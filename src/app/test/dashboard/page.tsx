// File: src/app/test/dashboard/page.tsx
'use client';
import { useState } from 'react';

export default function Dashboard() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/test/firestore-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      setResponse({ type: 'POST', data });
    } catch (err) {
      setResponse({ type: 'POST', error: err });
    } finally {
      setLoading(false);
    }
  };

  const handleGet = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/test/firestore-test');
      const data = await res.json();
      setResponse({ type: 'GET', data });
    } catch (err) {
      setResponse({ type: 'GET', error: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Test Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block">Name</label>
          <input
            className="w-full p-2 border rounded"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter name"
          />
        </div>
        <div className="space-y-2">
          <label className="block">Email</label>
          <input
            className="w-full p-2 border rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>
      </div>
      <div className="space-x-4">
        <button
          onClick={handlePost}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          POST
        </button>
        <button
          onClick={handleGet}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          GET
        </button>
      </div>
      <div className="mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : response ? (
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        ) : (
          <p>No response yet.</p>
        )}
      </div>
    </div>
)}
