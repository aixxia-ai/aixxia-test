'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Gate() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    if (code.length !== 6) { setError('Voer de 6-cijferige code in.'); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (res.ok) { router.push('/board'); return; }
      setError('Onjuiste toegangscode.');
    } catch {
      setError('Er ging iets mis. Probeer opnieuw.');
    }
    setCode(''); setLoading(false);
  }

  return (
    <main className="card">
      <span className="badge">Beveiligde toegang</span>
      <div className="brand">AIXXIA</div>
      <p className="sub">Voer je toegangscode in om de klankbordgroep te openen.</p>
      <form onSubmit={submit}>
        <input
          className="codeinput"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="••••••"
          value={code}
          autoFocus
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        />
        <button className="primary" type="submit" disabled={loading}>
          {loading ? 'Controleren…' : 'Toegang'}
        </button>
        <div className="error">{error}</div>
      </form>
    </main>
  );
}
