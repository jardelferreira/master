import React from "react";
import { Mail, Lock, LogIn, ShieldCheck, Archive } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] relative overflow-hidden">

      {/* Background */}
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40"></div>

      <div className="w-full max-w-md px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-xl bg-blue-100 mb-6">
            <Archive className="text-blue-700 w-8 h-8" />
          </div>

          <h1 className="text-3xl font-extrabold text-blue-600">
            Estoque Master
          </h1>

          <p className="text-xs uppercase tracking-widest text-gray-400 mt-2">
            O controle em suas mãos
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-xl p-8 border border-blue-100 ">

          <form className="space-y-6">

            {/* Email */}
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 ml-1">
                E-mail
              </label>

              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                <input
                  type="email"
                  placeholder="nome@empresa.com"
                  className="w-full bg-gray-100 rounded-lg py-3 pl-12 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase text-gray-400">
                  Senha
                </label>

                <a href="#" className="font-bold text-blue-600 hover:underline">
                  Esqueceu sua senha?
                </a>
              </div>

              <div className="relative mt-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-gray-100 rounded-lg py-3 pl-12 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600">
                Manter conectado
              </span>
            </div>

            {/* Button */}
            <button className="w-full bg-gradient-to-r from-blue-700 to-blue-600 text-white py-3 rounded-lg font-bold shadow-md hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center gap-2">
              Entrar
              <LogIn className="w-4 h-4" />
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-sm text-gray-400">
              Não tem uma conta?
            </p>

            <a className="text-blue-600 font-semibold hover:cursor-pointer hover:underline mt-2 inline-block">
              Solicitar acesso ao sistema
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" />
          Secure Enterprise Portal
        </div>
      </div>
    </div>
  );
}