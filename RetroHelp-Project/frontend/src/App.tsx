function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4 backdrop-blur">
        <h1 className="text-xl font-semibold tracking-tight text-white">
          RetroHelp
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          React + Vite + Tailwind frontend. API runs on Laravel at{' '}
          <code className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-200">
            http://localhost:8000
          </code>
          .
        </p>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-slate-300">
          Use{' '}
          <code className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-200">
            npm run dev
          </code>{' '}
          (port 5173) with the Laravel backend and MySQL per{' '}
          <code className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-200">
            RETROHELP.sql
          </code>
          .
        </p>
      </main>
    </div>
  )
}

export default App
