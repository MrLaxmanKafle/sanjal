-- Accounts, profiles and chat.
-- Every table has row-level security on; nothing is readable without a policy.

-- ---------------------------------------------------------------------------
-- Sign-up gate: only Nepali mobile numbers (+977 9[678]XXXXXXXX) may create accounts.
-- Wired up as the before_user_created auth hook (see supabase/config.toml).
-- ---------------------------------------------------------------------------

create or replace function public.is_nepali_mobile(phone text)
returns boolean
language sql
immutable
as $$
  select coalesce(regexp_replace(phone, '^\+', '') ~ '^9779[678][0-9]{8}$', false);
$$;

create or replace function public.hook_before_user_created(event jsonb)
returns jsonb
language plpgsql
as $$
begin
  if public.is_nepali_mobile(event->'user'->>'phone') then
    return '{}'::jsonb;
  end if;
  return jsonb_build_object(
    'error', jsonb_build_object(
      'http_code', 400,
      'message', 'Sanjal accounts need a Nepali mobile number (+977).'
    )
  );
end;
$$;

grant execute on function public.hook_before_user_created(jsonb) to supabase_auth_admin;
grant execute on function public.is_nepali_mobile(text) to supabase_auth_admin;
revoke execute on function public.hook_before_user_created(jsonb) from authenticated, anon, public;

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 50),
  home_district text check (char_length(home_district) <= 50),
  current_city text not null default 'Kathmandu' check (char_length(current_city) <= 50),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Signed-in people can see profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "People create their own profile"
  on public.profiles for insert
  to authenticated
  with check (id = (select auth.uid()));

create policy "People edit their own profile"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Conversations: direct (two people) or group
-- ---------------------------------------------------------------------------

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('direct', 'group')),
  title text check (char_length(title) <= 80),
  created_by uuid not null default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create table public.conversation_members (
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  joined_at timestamptz not null default now(),
  last_read_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create index conversation_members_user_idx on public.conversation_members (user_id);

create table public.messages (
  id bigint generated always as identity primary key,
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index messages_conversation_created_idx on public.messages (conversation_id, created_at desc);

-- Membership check used by policies. Security definer so policies on
-- conversation_members can call it without recursing into themselves.
create or replace function public.is_member(conversation uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.conversation_members
    where conversation_id = conversation and user_id = (select auth.uid())
  );
$$;

alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;

create policy "Members see their conversations"
  on public.conversations for select
  to authenticated
  using (public.is_member(id));

create policy "Members see who is in their conversations"
  on public.conversation_members for select
  to authenticated
  using (public.is_member(conversation_id));

create policy "Members mark their own conversations read"
  on public.conversation_members for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Members read messages"
  on public.messages for select
  to authenticated
  using (public.is_member(conversation_id));

create policy "Members send messages as themselves"
  on public.messages for insert
  to authenticated
  with check (sender_id = (select auth.uid()) and public.is_member(conversation_id));

-- Conversations and memberships are only created through the functions below,
-- so there are no insert policies on those tables.

create or replace function public.touch_conversation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.conversations set last_message_at = new.created_at where id = new.conversation_id;
  update public.conversation_members set last_read_at = new.created_at
    where conversation_id = new.conversation_id and user_id = new.sender_id;
  return new;
end;
$$;

create trigger messages_touch_conversation
  after insert on public.messages
  for each row execute function public.touch_conversation();

-- Opens (or reuses) the direct conversation between the caller and the owner
-- of a Nepali mobile number. Returns null when no Sanjal account has that number.
create or replace function public.start_direct_chat(phone text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := auth.uid();
  other uuid;
  existing uuid;
  created uuid;
begin
  if me is null then
    raise exception 'Not signed in';
  end if;
  if not public.is_nepali_mobile(phone) then
    raise exception 'Not a Nepali mobile number';
  end if;

  select id into other from auth.users where auth.users.phone = regexp_replace(start_direct_chat.phone, '^\+', '');
  if other is null then
    return null;
  end if;
  if other = me then
    raise exception 'That is your own number';
  end if;

  select c.id into existing
  from public.conversations c
  join public.conversation_members a on a.conversation_id = c.id and a.user_id = me
  join public.conversation_members b on b.conversation_id = c.id and b.user_id = other
  where c.kind = 'direct'
  limit 1;
  if existing is not null then
    return existing;
  end if;

  insert into public.conversations (kind, created_by) values ('direct', me) returning id into created;
  insert into public.conversation_members (conversation_id, user_id) values (created, me), (created, other);
  return created;
end;
$$;

revoke execute on function public.start_direct_chat(text) from anon, public;
grant execute on function public.start_direct_chat(text) to authenticated;

-- One row per conversation for the chat list: the other person's name for a
-- direct chat, the latest message, and whether it is unread.
create or replace view public.my_conversations
with (security_invoker = true)
as
select
  c.id,
  c.kind,
  coalesce(c.title, other_profile.display_name, 'Sanjal user') as title,
  c.last_message_at,
  last_message.body as last_message,
  last_message.created_at > me.last_read_at as unread
from public.conversations c
join public.conversation_members me on me.conversation_id = c.id and me.user_id = (select auth.uid())
left join lateral (
  select p.display_name
  from public.conversation_members m
  join public.profiles p on p.id = m.user_id
  where m.conversation_id = c.id and m.user_id <> me.user_id
  limit 1
) other_profile on c.kind = 'direct'
left join lateral (
  select body, created_at from public.messages
  where conversation_id = c.id
  order by created_at desc
  limit 1
) last_message on true;

grant select on public.my_conversations to authenticated;

-- Live updates for open chats.
alter publication supabase_realtime add table public.messages;
