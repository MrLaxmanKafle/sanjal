// Integration test against a local Supabase (`npx supabase start`).
// Run with: npm run test:db
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = process.env.SUPABASE_URL ?? 'http://127.0.0.1:54321';
const KEY = process.env.SUPABASE_ANON_KEY;
if (!KEY) throw new Error('Set SUPABASE_ANON_KEY (printed by `npx supabase status`)');

// These numbers have a fixed code in supabase/config.toml [auth.sms.test_otp].
const ASHA = '+9779800000001';
const BIKASH = '+9779800000002';
const CHANDRA = '+9779800000003';

async function signIn(phone: string): Promise<SupabaseClient> {
  const client = createClient(URL, KEY!, { auth: { persistSession: false } });
  const sent = await client.auth.signInWithOtp({ phone });
  assert.equal(sent.error, null, `send code to ${phone}`);
  const verified = await client.auth.verifyOtp({ phone, token: '123456', type: 'sms' });
  assert.equal(verified.error, null, `verify ${phone}`);
  return client;
}

test('foreign numbers cannot create an account', async () => {
  const client = createClient(URL, KEY!, { auth: { persistSession: false } });
  const { error } = await client.auth.signInWithOtp({ phone: '+61400000000' });
  assert.ok(error, 'expected sign-up to be rejected');
  assert.match(error.message, /Nepali mobile number/);
});

test('two people can chat, and nobody else can read it', async () => {
  const asha = await signIn(ASHA);
  const bikash = await signIn(BIKASH);

  for (const [client, name] of [
    [asha, 'Asha'],
    [bikash, 'Bikash'],
  ] as const) {
    const { data } = await client.auth.getUser();
    const { error } = await client.from('profiles').upsert({ id: data.user!.id, display_name: name });
    assert.equal(error, null);
  }

  const started = await asha.rpc('start_direct_chat', { phone: BIKASH });
  assert.equal(started.error, null);
  const conversationId = started.data as string;
  assert.ok(conversationId);

  const again = await bikash.rpc('start_direct_chat', { phone: ASHA });
  assert.equal(again.data, conversationId, 'reuses the same direct chat');

  const sent = await asha.from('messages').insert({ conversation_id: conversationId, body: 'नमस्ते!' });
  assert.equal(sent.error, null);

  const inbox = await bikash.from('my_conversations').select('*');
  assert.equal(inbox.error, null);
  const row = inbox.data!.find((c) => c.id === conversationId);
  assert.equal(row?.title, 'Asha');
  assert.equal(row?.last_message, 'नमस्ते!');
  assert.equal(row?.unread, true);

  const unknown = await asha.rpc('start_direct_chat', { phone: '+9779812345678' });
  assert.equal(unknown.data, null, 'no account for that number');

  // Another signed-in person cannot read or post into it.
  const chandra = await signIn(CHANDRA);
  const snoop = await chandra.from('messages').select('*').eq('conversation_id', conversationId);
  assert.deepEqual(snoop.data, []);
  const intrude = await chandra.from('messages').insert({ conversation_id: conversationId, body: 'hi' });
  assert.ok(intrude.error, 'expected non-member post to be rejected');

  // Someone signed out sees nothing.
  const anon = createClient(URL, KEY!, { auth: { persistSession: false } });
  const peek = await anon.from('messages').select('*').eq('conversation_id', conversationId);
  assert.deepEqual(peek.data, []);

  // A member cannot post as someone else.
  const { data: ashaUser } = await asha.auth.getUser();
  const forged = await bikash
    .from('messages')
    .insert({ conversation_id: conversationId, body: 'fake', sender_id: ashaUser.user!.id });
  assert.ok(forged.error, 'expected forged sender to be rejected');
});
