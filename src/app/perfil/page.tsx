"use client";
import React, { useEffect, useState } from "react";
import PasswordInput from "@/components/PasswordInput";
import { UsuarioService } from "@/app/services/paciente.service";

interface UserInfo {
  email: string;
  nombre: string;
  apellido: string;
  usuario?: string;
}

export default function Perfil() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cambio de clave
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [touchedRepeat, setTouchedRepeat] = useState(false);

  const newValid = newPassword.length >= 8;
  const repeatMatch =
    repeatPassword.length > 0 && newPassword === repeatPassword;
  const diffFromCurrent =
    currentPassword.length > 0 && newPassword && currentPassword !== newPassword;

  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem("accessToken");
          let emailFromToken = "";
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split(".")[1]));
              emailFromToken = payload.email || payload.sub || "";
            } catch {
              // invalid token format
            }
          }
        const resp = await UsuarioService.listarUsuario({
          filtro: emailFromToken,
          pagina: 1,
          tamano: 1,
        });
        console.log(resp);

        // Ajusta según la forma real de la respuesta
        const usuarioData = resp?.items?.[0] || resp?.data?.[0] || resp;
        if (usuarioData) {
          setUser({
            email: usuarioData.correo,
            nombre: usuarioData.nombre,
            apellido: usuarioData.apellido,
            usuario: usuarioData.correo.split("@")[0],
          });
        }
        console.log(usuarioData);
      } catch {
        // silent
      } finally {
        setLoadingUser(false);
      }
    }
    loadUser();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValid || !repeatMatch || !diffFromCurrent) return;
    setSaving(true);
    try {
      const accessToken = localStorage.getItem("token"); // Asegúrate de guardar esto al autenticar
      if (!accessToken) {
        alert("Sesión inválida. Vuelva a iniciar sesión.");
        return;
      }
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken,previousPassword: currentPassword, proposedPassword: newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Contraseña actualizada.");
        setCurrentPassword("");
        setNewPassword("");
        setRepeatPassword("");
        setTouchedRepeat(false);
      } else {
        alert(data.message || "Error al cambiar la contraseña.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="bg-white rounded-md shadow-sm p-8 mt-8 mx-auto"
      style={{ maxWidth: 1200 }}
    >
      <h2 className="text-2xl font-semibold text-center mb-8 border-b pb-4">
        MI PERFIL
      </h2>

      {/* Datos usuario */}
      <div className="max-w-3xl mx-auto mb-10">
        {loadingUser ? (
          <p className="text-sm text-gray-500">Cargando datos...</p>
        ) : user ? (
          <>
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-2">NOMBRE</label>
                <input
                  type="text"
                  className="form-control bg-gray-100"
                  value={user.nombre}
                  disabled
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-2">APELLIDO</label>
                <input
                  type="text"
                  className="form-control bg-gray-100"
                  value={user.apellido}
                  disabled
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2" htmlFor="email">
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                className="form-control bg-gray-100"
                value={user.email}
                disabled
              />
            </div>
            
          </>
        ) : (
          <p className="text-sm text-red-600">No se pudo cargar la información.</p>
        )}
      </div>

      {/* Cambio de contraseña */}
      <form onSubmit={handleChangePassword} className="max-w-3xl mx-auto">
        <h3 className="text-lg font-semibold mb-6">Cambio de contraseña</h3>

        <div className="mb-4">
          <PasswordInput
            name="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            label="Clave actual"
            autoComplete="current-password"
          />
        </div>

        <div className="mb-4">
          <PasswordInput
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            label="Nueva clave"
            autoComplete="new-password"
          />
          {!newValid && newPassword.length > 0 && (
            <p className="text-xs text-orange-600 mt-1">Mínimo 8 caracteres.</p>
          )}
          {diffFromCurrent === false && newValid && (
            <p className="text-xs text-red-600 mt-1">
              La nueva clave no puede ser igual a la actual.
            </p>
          )}
        </div>

        <div className="mb-6">
          <PasswordInput
            name="repeatPassword"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            onBlur={() => setTouchedRepeat(true)}
            label="Repetir nueva clave"
            autoComplete="new-password"
          />
          {touchedRepeat && repeatPassword && !repeatMatch && (
            <p className="text-xs text-red-600 mt-1">Las claves no coinciden.</p>
          )}
          {repeatMatch && newValid && diffFromCurrent && (
            <p className="text-xs text-green-600 mt-1">Las claves coinciden.</p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={
              saving ||
              !newValid ||
              !repeatMatch ||
              !diffFromCurrent ||
              !currentPassword
            }
            className={`btn btn-primary px-5 py-2 rounded-pill ${
              saving ||
              !newValid ||
              !repeatMatch ||
              !diffFromCurrent ||
              !currentPassword
                ? "opacity-60 cursor-not-allowed"
                : ""
            }`}
            style={{ background: "#3B5BA9", border: "none" }}
          >
            {saving ? "Guardando..." : "Actualizar mis datos"}
          </button>
        </div>
      </form>
    </div>
  );
}
