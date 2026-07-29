'use client';
import { useState, useRef, useEffect } from 'react';

const STARTER = 'Bijvoorbeeld: "We willen komend jaar internationaal uitbreiden naar Duitsland."';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  async function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    const history = [...messages, { role: 'user', content: text }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setInput('');
    setBusy(true);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json().catch(() => ({}));
      const answer = res.ok && data.text
        ? data.text
        : `⚠️ ${data.detail || data.error || 'Er ging iets mis. Probeer het opnieuw.'}`;
      setMessages((m) => {
        const copy = m.slice();
        copy[copy.length - 1] = { role: 'assistant', content: answer };
        return copy;
      });
    } catch {
      setMessages((m) => {
        const copy = m.slice();
        copy[copy.length - 1] = { role: 'assistant', content: '⚠️ Er ging iets mis. Probeer het opnieuw.' };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(e);
    }
  }

  const lastEmpty = busy && messages.length > 0 && messages[messages.length - 1].content === '';

  return (
    <div className="chat">
      <div className="messages" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="hint">
            Leg een strategisch voornemen of dilemma voor. De sparringpartner challenget je aannames,
            wijst blinde vlekken aan en stelt de kernvraag.
            <br /><br />
            <span className="muted">{STARTER}</span>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`msg ${m.role}${lastEmpty && i === messages.length - 1 ? ' typing' : ''}`}
          >
            {lastEmpty && i === messages.length - 1 ? 'Denkt na…' : m.content}
          </div>
        ))}
      </div>
      <form className="composer" onSubmit={send}>
        <textarea
          rows={2}
          placeholder="Typ je voorstel of vraag…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={busy}
        />
        <button className="primary" type="submit" disabled={busy || !input.trim()}>
          {busy ? '…' : 'Stuur'}
        </button>
      </form>
    </div>
  );
}
