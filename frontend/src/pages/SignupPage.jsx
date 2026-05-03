import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, User, Briefcase } from 'lucide-react'
import AuthShell from '../components/auth/AuthShell'
import FormField from '../components/auth/FormField'
import GradientButton from '../components/auth/GradientButton'
import { useAuth } from '../context/AuthContext'

function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    primaryUseCase: 'general',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (event) => {
    if (fieldErrors[event.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [event.target.name]: '' }))
    }

    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.name.trim()) {
      nextErrors.name = 'Enter your full name.'
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Enter your work email.'
    }

    if (!form.password) {
      nextErrors.password = 'Create a password.'
    } else if (form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }

    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      await signup(form)
      navigate('/dashboard')
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Account setup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Create your Nexora account"
      subtitle="We'll learn your preferences as you route. Better answers from query one."
      footer={
        <p>
          Already using Nexora?{' '}
          <Link className="font-semibold text-indigo-600 transition hover:text-indigo-700" to="/login">
            Sign in
          </Link>
        </p>
      }
    >
      <div className="mb-6 rounded-lg border border-indigo-100/60 bg-indigo-50/70 px-4 py-3 text-sm text-indigo-700">
        <p className="font-semibold">How will you use Nexora?</p>
        <p className="mt-1 text-xs text-indigo-600">Helps us optimize routing for your workflow</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4.5">
        <FormField
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={onChange}
          label="Full name"
          placeholder="Alex Johnson"
          icon={User}
          error={fieldErrors.name}
          required
          autoComplete="name"
        />

        <FormField
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          label="Work email"
          placeholder="name@company.com"
          icon={Mail}
          error={fieldErrors.email}
          required
          autoComplete="email"
        />

        <FormField
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={onChange}
          label="Create password"
          placeholder="At least 8 characters"
          icon={Lock}
          error={fieldErrors.password}
          required
          autoComplete="new-password"
          helperText="Use 8+ characters with letters and numbers."
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="rounded p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="relative block rounded-lg border border-slate-300 bg-white px-4 py-3.5 text-sm transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/30">
            <span className="pointer-events-none mb-2 inline-block text-xs font-semibold text-slate-700 uppercase">Current role</span>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4.5 w-4.5 text-slate-400" />
              <select
                name="role"
                value={form.role}
                onChange={onChange}
                className="w-full bg-transparent text-slate-900 outline-none text-sm font-medium"
              >
                <option value="student">Student</option>
                <option value="professional">Professional</option>
              </select>
            </div>
          </label>

          <label className="relative block rounded-lg border border-slate-300 bg-white px-4 py-3.5 text-sm transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/30">
            <span className="pointer-events-none mb-2 inline-block text-xs font-semibold text-slate-700 uppercase">Primary workflow</span>
            <select
              name="primaryUseCase"
              value={form.primaryUseCase}
              onChange={onChange}
              className="w-full bg-transparent text-slate-900 outline-none text-sm font-medium"
            >
              <option value="coding">Coding</option>
              <option value="writing">Writing</option>
              <option value="research">Research</option>
              <option value="image_generation">Image Generation</option>
              <option value="general">General</option>
            </select>
          </label>
        </div>

        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <GradientButton type="submit" disabled={loading} loading={loading} loadingText="Creating your account..." className="mt-7">
          Create account
        </GradientButton>
      </form>
    </AuthShell>
  )
}

export default SignupPage
