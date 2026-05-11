import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Select } from '../../components/common/Select'
import { useAuth } from '../../hooks/useAuth'
import { AuthShell } from './AuthShell'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.email(),
  password: z.string().min(5, 'Password must be at least 5 characters'),
  role: z.enum(['ADMIN', 'CREW']),
})

type FormValues = z.infer<typeof schema>

export function RegisterPage() {
  const { register: registerUser } = useAuth()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'CREW' },
  })

  return (
    <AuthShell title="Create account" subtitle="Register an admin or crew user for the platform.">
      <form className="space-y-4" onSubmit={form.handleSubmit((values) => registerUser.mutate(values))}>
        <Input label="Full name" error={form.formState.errors.name?.message} {...form.register('name')} />
        <Input label="Email" type="email" error={form.formState.errors.email?.message} {...form.register('email')} />
        <Input label="Password" type="password" error={form.formState.errors.password?.message} {...form.register('password')} />
        <Select
          label="Role"
          options={[
            { label: 'Crew', value: 'CREW' },
            { label: 'Admin', value: 'ADMIN' },
          ]}
          error={form.formState.errors.role?.message}
          {...form.register('role')}
        />
        <Button className="w-full" isLoading={registerUser.isPending} type="submit">
          Create account
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        Already registered? <Link className="font-semibold text-harbor-700" to="/login">Sign in</Link>
      </p>
    </AuthShell>
  )
}
