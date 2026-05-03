// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion'

function FormField({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  icon: Icon,
  error,
  placeholder,
  helperText,
  required = false,
  autoComplete,
  rightSlot,
  disabled = false,
}) {
  const inputClassName = `w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 ${error ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/20' : ''}`

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="group relative">
        {Icon ? (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
        ) : null}

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={inputClassName}
          style={{ paddingLeft: Icon ? 36 : undefined, paddingRight: rightSlot ? 40 : undefined }}
        />

        {rightSlot ? <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightSlot}</div> : null}
      </div>

      {!error && helperText ? <p className="mt-2 text-xs text-slate-600">{helperText}</p> : null}

      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="mt-2 text-xs font-medium text-rose-700"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default FormField
