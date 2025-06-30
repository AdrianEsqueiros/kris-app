"use client";
import { useState } from "react";
import PasswordInput from "./components/passwordInput";

export default function RegisterForm() {
  const [step, setStep] = useState<"register" | "confirm">("register");
  const [loading, setLoading] = useState(false); // Spinner 👈
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    code: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // ⏳ Inicia spinner

    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({
        username: formData.email,
        password: formData.password,
        email: formData.email,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (res.ok) {
      alert("Se envió un código de confirmación al correo");
      setStep("confirm");
    } else {
      alert("Error: " + data.message);
    }

    setLoading(false); // ✅ Finaliza spinner
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // ⏳ Inicia spinner

    const res = await fetch("/api/confirm", {
      method: "POST",
      body: JSON.stringify({
        username: formData.email,
        code: formData.code,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (res.ok) {
      const dbRes = await fetch("/api/register-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          nombre: formData.name,
          apellido: formData.surname,
        }),
      });

      const dbData = await dbRes.json();

      if (dbRes.ok) {
        alert("Cuenta confirmada y registrada correctamente.");
        window.location.href = "/login";
      } else {
        alert(
          "Confirmado, pero error al registrar en la base de datos: " +
            dbData.message
        );
      }
    } else {
      alert("Error: " + data.message);
    }

    setLoading(false); // ✅ Finaliza spinner
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

        {step === "register" ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Tu nombre"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Tu apellido"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Correo electrónico"
              />
            </div>

            <PasswordInput value={formData.password} onChange={handleChange} />

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2 px-4 rounded flex items-center justify-center gap-2 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <>
                  <i className="bi bi-arrow-repeat animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  Crear cuenta
                  <i className="bi bi-arrow-right-circle" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Código de verificación
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Código enviado por correo"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2 px-4 rounded flex items-center justify-center gap-2 ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? (
                <>
                  <i className="bi bi-arrow-repeat animate-spin" />
                  Confirmando...
                </>
              ) : (
                <>
                  Confirmar cuenta
                  <i className="bi bi-check-circle" />
                </>
              )}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-600 mt-4">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
