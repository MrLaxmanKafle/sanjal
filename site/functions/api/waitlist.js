// Saves a waitlist email to the WAITLIST KV namespace.
// Key: the lowercased email. Value: when it was first added.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export async function onRequestPost({ request, env }) {
  let email = '';
  try {
    const type = request.headers.get('content-type') || '';
    if (type.includes('application/json')) {
      email = (await request.json()).email;
    } else {
      email = (await request.formData()).get('email');
    }
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  email = String(email || '').trim().toLowerCase();
  if (email.length > 254 || !EMAIL.test(email)) {
    return json({ ok: false, error: 'invalid_email' }, 400);
  }
  if (!env.WAITLIST) {
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  const existing = await env.WAITLIST.get(email);
  if (!existing) {
    await env.WAITLIST.put(email, new Date().toISOString());
  }
  return json({ ok: true }, 200);
}
