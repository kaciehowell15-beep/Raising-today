import React, { useState, useEffect } from 'react'

const App = () => {
  const [content, setContent] = useState([])
  const [todayContent, setTodayContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('today')
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState('idle')

  useEffect(() => {
    fetch('/daily_content.json').then(res => res.json()).then(data => {
      setContent(data)
      const today = new Date().toISOString().split('T')[0]
      setTodayContent(data.find(item => item.date === today) || data[0])
      setLoading(false)
    }).catch(err => { console.error(err); setLoading(false) })
  }, [])

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setSubStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) { setSubStatus('success'); setEmail('') }
      else { setSubStatus('error') }
    } catch { setSubStatus('error') }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-brand-warm"><p className="text-brand-soft italic">Loading your daily dose of calm...</p></div>

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-2xl mx-auto font-sans text-brand-text">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold mb-2">Raising Today</h1>
        <p className="text-brand-soft italic">A moment of peace in the parenting journey</p>
        <nav className="mt-8 flex justify-center gap-6 text-sm font-medium uppercase tracking-widest text-brand-soft">
          <button onClick={() => setView('today')} className={`pb-1 border-b-2 ${view === 'today' ? 'border-brand-soft text-brand-text' : 'border-transparent hover:text-brand-text'}`}>Today</button>
          <button onClick={() => setView('archive')} className={`pb-1 border-b-2 ${view === 'archive' ? 'border-brand-soft text-brand-text' : 'border-transparent hover:text-brand-text'}`}>Archive</button>
        </nav>
      </header>
      <main>
        {view === 'today' ? (
          todayContent ? (
            <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12 mb-8 border border-brand-accent/20">
              <h2 className="text-2xl font-serif font-semibold mb-6">{todayContent.title}</h2>
              <div className="space-y-6 text-lg leading-relaxed opacity-90">
                <p>{todayContent.reflection}</p>
                {todayContent.prompt && (
                  <div className="bg-brand-warm/50 p-6 rounded-2xl italic text-brand-soft border-l-4 border-brand-accent">
                    <p className="font-semibold not-italic mb-1 uppercase text-xs tracking-widest">Today's Prompt</p>
                    {todayContent.prompt}
                  </div>
                )}
              </div>
            </div>
          ) : <p className="text-center text-brand-soft">No content for today.</p>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-serif font-semibold mb-6">Past Reflections</h2>
            {content.map((item, i) => (
              <button key={i} onClick={() => { setTodayContent(item); setView('today') }}
                className="w-full text-left bg-white p-6 rounded-2xl shadow-sm border border-brand-accent/10 hover:border-brand-accent">
                <p className="text-xs text-brand-soft uppercase tracking-widest mb-1">{item.date}</p>
                <h3 className="text-lg font-serif font-medium">{item.title}</h3>
              </button>
            ))}
          </div>
        )}
        <section className="mt-16 border-t border-brand-accent/30 pt-12 text-center">
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-brand-accent/20 mb-8">
            <h3 className="text-xl font-serif font-semibold mb-2">Join the Community</h3>
            <p className="text-brand-soft mb-6">Get daily encouragement delivered to your inbox.</p>
            <form className="flex flex-col md:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubscribe}>
              <input type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="flex-1 px-6 py-3 rounded-full border border-brand-accent/30 focus:outline-none focus:border-brand-soft bg-brand-warm/30" />
              <button type="submit" disabled={subStatus === 'loading'}
                className="bg-brand-soft text-brand-warm px-8 py-3 rounded-full font-semibold hover:bg-brand-text disabled:opacity-50">
                {subStatus === 'loading' ? 'Joining...' : 'Subscribe'}
              </button>
              {subStatus === 'success' && <p className="text-green-700 text-sm mt-2">You're in! Welcome 💛</p>}
              {subStatus === 'error' && <p className="text-red-600 text-sm mt-2">Something went wrong.</p>}
            </form>
          </div>
          <div className="bg-brand-accent/10 p-8 rounded-3xl">
            <h3 className="text-xl font-serif font-semibold mb-4">Go Premium</h3>
            <p className="text-brand-soft mb-6">Unlock weekly deep reflections, audio versions, and printable activity cards for $4.99/month.</p>
            <button className="bg-brand-soft text-brand-warm px-10 py-4 rounded-full font-semibold hover:bg-brand-text">Try Raising Today Premium</button>
          </div>
        </section>
      </main>
      <footer className="mt-20 text-center text-xs text-brand-soft/60 pb-8">&copy; 2026 Raising Today.</footer>
    </div>
  )
}
export default App
