import { NextResponse } from 'next/server';
import { AGENT_MODEL, SYSTEM_PROMPT } from '../../../lib/agent';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Server niet geconfigureerd (geen API-key).' }, { status: 500 });
  }

  let raw = [];
  try {
    const body = await request.json();
    raw = Array.isArray(body?.messages) ? body.messages : [];
  } catch {}

  const messages = raw
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content }));

  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return NextResponse.json({ error: 'Ongeldige invoer.' }, { status: 400 });
  }

  let upstream;
  try {
    upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: AGENT_MODEL,
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        thinking: { type: 'disabled' },
        messages,
      }),
    });
  } catch (e) {
    return NextResponse.json({ error: 'Kan de AI niet bereiken.', detail: String(e).slice(0, 300) }, { status: 502 });
  }

  const data = await upstream.json().catch(() => null);
  if (!upstream.ok || !data) {
    const detail = data?.error?.message || `HTTP ${upstream.status}`;
    return NextResponse.json({ error: 'AI-fout', detail: String(detail).slice(0, 300) }, { status: 502 });
  }

  const text = Array.isArray(data.content)
    ? data.content.filter((b) => b.type === 'text').map((b) => b.text).join('').trim()
    : '';

  if (!text) {
    return NextResponse.json({ error: 'Leeg antwoord van de AI.', stop: data.stop_reason || null }, { status: 502 });
  }

  return NextResponse.json({ text });
}
