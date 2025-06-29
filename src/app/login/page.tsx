"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_user: email, pass_user: password }),
      });

      if (!response.ok) throw new Error("Error en login");

      // Redireccionar al dashboard o página protegida
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-center mb-6">
          <h2 className="m-0 mb-10 text-2xl font-bold tracking-tight">
            <span className="text-[#B5C7D3]">Healthy</span>
            <span className="text-[#3B5BA9]">Core</span>
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email_user"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Escribe tu email"
              autoFocus
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Clave
              </label>
              <a
                href="/recovery-password"
                className="text-sm text-blue-600 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <input
              type="password"
              name="pass_user"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="••••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            Entrar ahora
            <i className="bi bi-arrow-right-circle" />
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          ¿No tienes cuenta?{" "}
          <a href="/register-user" className="text-blue-600 hover:underline">
            Crear cuenta
          </a>
        </p>
      </div>
    </div>
  );
}
