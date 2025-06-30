"use client";

import { useEffect, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      localStorage.removeItem("token");
      window.location.href = `/login`; // si necesitas reiniciar el login
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username: email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Login OK", data.token);

      if (data) {
        localStorage.setItem("token", data.token);
        window.location.href = `/paciente/listar`;
      }
    } else {
      const err = await res.json();
      alert("Error al iniciar sesión: " + err.message);
    }
  };

  return (
    <div className=" h-screen flex items-center justify-center bg-gray-100 ">
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
          <a href="/register" className="text-blue-600 hover:underline">
            Crear cuenta
          </a>
        </p>
      </div>
    </div>
  );
}
