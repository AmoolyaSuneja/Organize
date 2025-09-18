import { motion } from 'framer-motion'

function App() {
  return (
    <div className="min-h-screen app-gradient">
      <header className="sticky top-0 z-10 backdrop-blur border-b border-yellow-200/50 bg-white/70">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-brand-300" />
            <span className="font-semibold text-lg">Room Organizer</span>
          </div>
          <a className="text-sm text-slate-600 hover:text-slate-900" href="#">Docs</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold tracking-tight"
            >
              Organize your space with a single image
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-4 text-lg text-slate-600"
            >
              Upload a photo of your room, closet, or kitchen. Get smart arrangement suggestions, apply filters, then save and share your design.
            </motion.p>
            <div className="mt-8">
              <a href="#upload" className="inline-flex items-center gap-2 rounded-lg bg-brand-400 text-white px-5 py-3 shadow-sm hover:bg-brand-500 transition-colors">Get Started</a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-yellow-200 bg-white shadow-sm p-6"
          >
            <div id="upload" className="aspect-video grid place-items-center rounded-xl border border-dashed border-yellow-300 bg-brand-50/60">
              <p className="text-slate-600">Upload area will go here</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default App
