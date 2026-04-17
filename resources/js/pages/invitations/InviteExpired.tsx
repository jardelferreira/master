import { Link } from "@inertiajs/react";

export default function InviteExpired() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Convite expirado ⏰
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Este convite não é mais válido. Solicite um novo acesso ao sistema.
        </p>

        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Voltar para início
        </Link>

      </div>
    </div>
  );
}