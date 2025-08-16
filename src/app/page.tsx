'use client';
import { useState } from 'react';
import FileDrop from './components/FileDrop';

export default function HomePage() {
  const [transcript, setTranscript] = useState('');
  const [prompt, setPrompt] = useState('Summarize in concise bullet points and highlight action items.');
  const [summary, setSummary] = useState('');
  const [emailTo, setEmailTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleGenerate = async () => {
    setStatus(null);
    setLoading(true);
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, prompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to summarize');
      setSummary(data.summary);
    } catch (e) {
      const error = e as Error;
      setStatus(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    setStatus(null);
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: emailTo, subject: 'Meeting Summary', html: `<pre style="white-space:pre-wrap">${summary}</pre>` })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send email');
      setStatus('Email sent successfully!');
    } catch (e) {
      const error = e as Error;
      setStatus(error.message);
    }

  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4 text-sm">
      <h1 className="text-2xl font-semibold">AI Meeting Summarizer</h1>

      <section className="space-y-2">
        <label className="block font-medium">Transcript</label>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your transcript here..."
          className="w-full h-40 border rounded p-2"
        />
      </section>

      <section className="space-y-2">
        <label className="block font-medium">Custom Instruction / Prompt</label>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full border rounded p-2"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !transcript}
          className="px-3 py-2 border rounded disabled:opacity-50"
        >
          {loading ? 'Generating…' : 'Generate Summary'}
        </button>
      </section>

      <section className="space-y-2">
        <label className="block font-medium">Editable Summary</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Your AI summary will appear here. You can edit before sharing."
          className="w-full h-56 border rounded p-2"
        />
      </section>

      <section className="space-y-2">
        <label className="block font-medium">Share via Email</label>
        <input
          type="email"
          value={emailTo}
          onChange={(e) => setEmailTo(e.target.value)}
          placeholder="recipient@example.com"
          className="w-full border rounded p-2"
        />
        <button
          onClick={handleSend}
          disabled={!summary || !emailTo}
          className="px-3 py-2 border rounded disabled:opacity-50"
        >
          Send Email
        </button>
      </section>

      {status && (
        <p className="text-xs">{status}</p>
      )}
    </main>
  );
}
