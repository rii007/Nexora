import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import AuthShell from '../components/auth/AuthShell'
import FormField from '../components/auth/FormField'
import GradientButton from '../components/auth/GradientButton'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(true)
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

    if (!form.email.trim()) {
      nextErrors.email = 'Enter your work email.'
    }

    if (!form.password) {
      nextErrors.password = 'Enter your password.'
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
      await login(form, { remember: rememberMe })
      navigate('/dashboard')
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Sign in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Continue routing with Nexora. We make smarter AI choices for you."
      footer={
        <p>
          New to Nexora?{' '}
          <Link className="font-semibold text-indigo-600 transition hover:text-indigo-700" to="/signup">
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4.5">
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
          label="Password"
          placeholder="Enter your password"
          icon={Lock}
          error={fieldErrors.password}
          required
          autoComplete="current-password"
          helperText="Use at least 8 characters."
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

        <div className="flex items-center justify-between pt-1">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600 transition hover:text-slate-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 bg-white text-indigo-600 transition focus:ring-2 focus:ring-indigo-500/20"
            />
            Keep me signed in
          </label>
          <button type="button" className="text-sm text-indigo-600 transition hover:text-indigo-700">
            Forgot password?
          </button>
        </div>

        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <GradientButton type="submit" disabled={loading} loading={loading} loadingText="Signing you in..." className="mt-7">
          Continue to Nexora
        </GradientButton>
      </form>
    </AuthShell>
  )
}

export default LoginPage
