// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="relative min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Subtle gradient blob */}
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-linear-to-br from-indigo-100 to-transparent opacity-20 blur-3xl"></div>
      <div className="mx-auto w-full max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="grid items-center gap-12 lg:grid-cols-[1.15fr_520px]"
        >
          <section className="hidden lg:block">
            <div className="max-w-lg">
              <p className="text-xs font-semibold tracking-[0.25em] text-indigo-700 uppercase">Nexora</p>
              <p className="mt-1.5 text-sm text-slate-500">Smart AI routing platform</p>

              <h2 className="mt-12 text-5xl font-bold leading-[1.1] tracking-tight text-slate-900">
                Route smarter.
              </h2>
              <p className="mt-4 text-base leading-[1.7] text-slate-600">
                Nexora reads intent and context to pick the best model automatically. No switching. Better answers.
              </p>

              <ul className="mt-10 space-y-3.5 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                  <span>Better quality without model switching</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                  <span>Learns from your feedback over time</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                  <span>Works across all your use cases</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg sm:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/70 px-3 py-1.5 text-xs font-bold tracking-[0.2em] text-indigo-700 uppercase">
                Nexora
              </div>
              <h1 className="mt-7 text-3xl font-bold leading-[1.15] tracking-tight text-slate-900">{title}</h1>
              <p className="mt-3 text-sm leading-[1.65] text-slate-600">{subtitle}</p>

              <div className="mt-9">{children}</div>
              <div className="mt-8 text-sm text-slate-600">{footer}</div>
            </div>
          </section>
        </motion.div>
      </div>
    </main>
  )
}

export default AuthShell
