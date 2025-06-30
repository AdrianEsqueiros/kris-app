"use client";

import { useEffect, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // 👉 estado para spinner

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
      window.location.href = `/login`;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // 👉 activar spinner
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username: email, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      if (data) {
        localStorage.setItem("token", data.token);
        window.location.href = `/paciente/listar`;
      }
    } else {
      const err = await res.json();
      alert("Error al iniciar sesión: " + err.message);
    }

    setLoading(false); // 👉 desactivar spinner (por si no hubo redirección)
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <h2 className="m-0 text-2xl font-bold tracking-tight">
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

            {/* Campo contraseña con toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="pass_user"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 pr-10"
                placeholder="••••••••••"
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((prev) => !prev)}
                role="button"
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    setShowPassword((prev) => !prev);
                }}
              >
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading} // 👉 deshabilitado mientras carga
            className={`w-full py-2 px-4 rounded flex items-center justify-center gap-2 text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <i className="bi bi-arrow-repeat animate-spin" />
                Cargando...
              </>
            ) : (
              <>
                Entrar ahora
                <i className="bi bi-arrow-right-circle" />
              </>
            )}
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
