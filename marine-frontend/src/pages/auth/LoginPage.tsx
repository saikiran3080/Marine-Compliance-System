import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { useAuth } from '../../hooks/useAuth'
import { AuthShell } from './AuthShell'

const schema = z.object({
  email: z.email(),
  password: z.string().min(5, 'Password must be at least 5 characters'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const { login } = useAuth()
  const form = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <AuthShell title="Sign in" subtitle="Use your issued operations account.">
      <form className="space-y-4" onSubmit={form.handleSubmit((values) => login.mutate(values))}>
        <Input label="Email" type="email" error={form.formState.errors.email?.message} {...form.register('email')} />
        <Input label="Password" type="password" error={form.formState.errors.password?.message} {...form.register('password')} />
        <Button className="w-full" isLoading={login.isPending} type="submit">
          Sign in
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        Need access? <Link className="font-semibold text-harbor-700" to="/register">Create account</Link>
      </p>
    </AuthShell>
  )
}
