import { email } from "@/routes/password";
import { useForm } from "@inertiajs/react";

interface Invitation {
    email: string;
    name?: string;
    uuid: string;
}

export default function AcceptInvitation({ invitation }: { invitation: Invitation }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: invitation.email,
        password: "",
        password_confirmation: "",
    });

    const submit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route("invitations.accept", invitation.uuid),{
            onSuccess: (data) => {
                console.log("Convite aceito com sucesso:", data);
            },
            onError: (errors) => {
                console.error("Erro ao aceitar convite:", errors);
            },
        })
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">

                <h1 className="text-2xl text-center font-bold text-gray-800 mb-2">
                    Aceite de convite 🎉
                </h1>

                <p className="text-sm text-gray-500 mb-6">
                    Finalize seu cadastro para acessar a plataforma.
                </p>

                <div className="mb-4 text-sm text-gray-600">
                    <strong>Email:</strong> {invitation.email}
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Nome completo
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Senha
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && (
                            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600">
                            Confirmar senha
                        </label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password_confirmation && (
                            <p className="text-xs text-red-500 mt-1">{errors.password_confirmation}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                        {processing ? "Processando..." : "Criar conta"}
                    </button>
                </form>

            </div>
        </div>
    );
}