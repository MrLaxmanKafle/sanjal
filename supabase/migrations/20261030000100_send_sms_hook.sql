-- Sends sign-in codes through Sparrow SMS (a Nepali gateway, far cheaper than
-- Twilio for +977 numbers). Wired up as the send_sms auth hook.
--
-- Production setup, once:
--   select vault.create_secret('<sparrow token>', 'sparrow_sms_token');
--   select vault.create_secret('<approved sender id>', 'sparrow_sms_from');
-- Without those secrets (local development) the code is only logged; use the
-- test numbers in supabase/config.toml instead.

create extension if not exists pg_net with schema extensions;

create or replace function public.hook_send_sms(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  phone text := event->'user'->>'phone';
  code text := event->'sms'->>'otp';
  token text;
  sender text;
begin
  if not public.is_nepali_mobile(phone) then
    return jsonb_build_object('error', jsonb_build_object(
      'http_code', 400, 'message', 'Sanjal accounts need a Nepali mobile number (+977).'));
  end if;

  select decrypted_secret into token from vault.decrypted_secrets where name = 'sparrow_sms_token';
  select decrypted_secret into sender from vault.decrypted_secrets where name = 'sparrow_sms_from';

  if token is null or sender is null then
    raise log 'hook_send_sms: no Sparrow SMS secrets set, not sending to %', phone;
    return '{}'::jsonb;
  end if;

  perform net.http_post(
    url := 'https://api.sparrowsms.com/v2/sms/',
    body := jsonb_build_object(
      'token', token,
      'from', sender,
      -- Sparrow expects the 10-digit local number.
      'to', right(regexp_replace(phone, '^\+', ''), 10),
      'text', 'Sanjal code: ' || code || E'\nDo not share this code with anyone.'
    )
  );
  return '{}'::jsonb;
end;
$$;

revoke execute on function public.hook_send_sms(jsonb) from authenticated, anon, public;
grant execute on function public.hook_send_sms(jsonb) to supabase_auth_admin;
