'use client';

import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    const res = await fetch(`${API}/api/tasks`);
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const res = await fetch(`${API}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: input }),
    });
    const newTask = await res.json();
    setTasks([newTask, ...tasks]);
    setInput('');
  };

  const toggleTask = async (id: number) => {
    const res = await fetch(`${API}/api/tasks/${id}`, { method: 'PATCH' });
    const updated = await res.json();
    setTasks(tasks.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id: number) => {
    await fetch(`${API}/api/tasks/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const pending = tasks.filter((t) => !t.completed).length;

  return (
    <main style={{ maxWidth: 560, margin: '60px auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 4 }}>Tasks</h1>
      <p style={{ color: '#888', marginBottom: 24, fontSize: 14 }}>
        {pending} remaining
      </p>

      <form onSubmit={addTask} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task..."
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #ddd',
            fontSize: 15,
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            background: '#1a1a1a',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          Add
        </button>
      </form>

      {loading ? (
        <p style={{ color: '#aaa', textAlign: 'center' }}>Loading...</p>
      ) : tasks.length === 0 ? (
        <p style={{ color: '#aaa', textAlign: 'center' }}>No tasks yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: '#fff',
                borderRadius: 10,
                padding: '12px 16px',
                marginBottom: 8,
                border: '1px solid #eee',
              }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#1a1a1a' }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: 15,
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? '#aaa' : '#1a1a1a',
                }}
              >
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#ccc',
                  fontSize: 18,
                  lineHeight: 1,
                  padding: '0 4px',
                }}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
