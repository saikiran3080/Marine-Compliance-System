import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <label className="block">
      {label ? <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span> : null}
      <input
        className={`h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-harbor-500 focus:ring-4 focus:ring-harbor-100 ${className}`}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs font-medium text-signal-red">{error}</span> : null}
    </label>
  )
}
