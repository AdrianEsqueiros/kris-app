// app/not-found.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // redirige si no hay token
    } else {
      router.push("/paciente/listar"); // o la ruta principal si el usuario está logueado
    }
  }, []);

  return (
    <div className=" h-screen flex items-center justify-center bg-gray-100 ">
      <p className="text-center mt-10">Redirigiendo...</p>
    </div>
  );
}
