import { Head, useForm } from '@inertiajs/react'

type AcceptInvitationProps = {
  email: string
  uuid: string
}

type FormData = {
  password: string
  password_confirmation: string
  name: string
}

export default function AcceptInvitation({
  email,
  uuid,
}: AcceptInvitationProps) {
  const { data, setData, post, processing, errors } =
    useForm<FormData>({
      password: '',
      password_confirmation: '',
      name: '',
    })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    post(route('invitations.accept', uuid))
  }

  return (
    <>
      <Head title="Aceitar convite" />

      <main className="min-h-screen flex items-center justify-center bg-base-50 px-4">
        <div className="w-full max-w-md bg-white rounded-xl border border-base-200 shadow-sm">
          {/* Header */}
          <div className="px-6 py-5 border-b border-base-200">
            <h1 className="text-xl font-semibold text-base-900">
              Você foi convidado 🎉
            </h1>
            <p className="mt-1 text-sm text-base-600">
              Defina sua senha para acessar a plataforma
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="px-6 py-6 space-y-5">
            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-medium text-base-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="
                  w-full rounded-md border border-base-300
                  bg-base-100 px-3 py-2 text-sm text-base-700
                  cursor-not-allowed
                "
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-base-700 mb-1">
                Nome:
              </label>
              <input
                type="text"
                value={data.name}
                onChange={e => setData('name',e.target.value)}
                className="
                 w-full rounded-md border px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-core-500
                "
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-base-700 mb-1">
                Nova senha
              </label>
              <input
                type="password"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
                className={`
                  w-full rounded-md border px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-core-500
                  ${
                    errors.password
                      ? 'border-red-500'
                      : 'border-base-300'
                  }
                `}
                placeholder="••••••••"
                required
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirmação */}
            <div>
              <label className="block text-sm font-medium text-base-700 mb-1">
                Confirmar senha
              </label>
              <input
                type="password"
                value={data.password_confirmation}
                onChange={e =>
                  setData('password_confirmation', e.target.value)
                }
                className="
                  w-full rounded-md border border-base-300
                  px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-core-500
                "
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={processing}
              className="
                w-full inline-flex items-center justify-center gap-2
                rounded-md px-4 py-2.5
                bg-core-600 text-white font-medium
                hover:bg-core-700
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {processing && (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              Ativar conta
            </button>
          </form>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-base-200 text-center">
            <p className="text-xs text-base-500">
              Ao continuar, você concorda em acessar a plataforma de forma
              segura.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}