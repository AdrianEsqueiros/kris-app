"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// 1. Define los íconos como clases de Bootstrap Icons
const sidebarItems = [
  {
    label: "Registrar Paciente",
    iconClass: "bi bi-person-bounding-box",
    path: "/paciente/registrar",
  },
  {
    label: "Lista de Pacientes",
    iconClass: "bi bi-person-lines-fill",
    path: "/paciente/listar",
  },
  {
    label: "Modulo de Predicción",
    iconClass: "bi bi-bar-chart-line-fill",
    path: "/paciente/informacion",
  },

  {
    label: "Lista de Usuarios",
    iconClass: "bi bi-person-lines-fill",
    path: "/usuarios",
  },
  // {
  //   label: "Mi Perfil",
  //   iconClass: "bi bi-person-fill-gear",
  //   path: "/perfil",
  // },
  {
    label: "Salir",
    iconClass: "bi bi-lock",
    path: "/login",
  },
];

export default function Sidebar() {
  const [token, setToken] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return (
    <>
      {token && (
        <aside className="w-[240px] h-screen bg-[#F7F8FA] text-[#22223B] p-6 flex flex-col gap-4 box-border">
          <h2 className="m-0 mb-10 text-2xl font-bold tracking-tight">
            <span className="text-[#B5C7D3]">Healthy</span>
            <span className="text-[#3B5BA9]">Core</span>
          </h2>
          <nav>
            <ul className="list-none p-0 m-0">
              {sidebarItems.map((item) => {
                const isActive = pathname.startsWith(item.path);
                return (
                  <li key={item.path} className="mb-2 last:mb-0">
                    <Link
                      href={item.path ?? ""}
                      className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors w-full text-left no-underline
          ${
            isActive
              ? "bg-[#E6F4EA] text-[#22C55E] font-semibold "
              : "hover:bg-gray-100 text-[#6B7280]"
          }
        `}
                      style={
                        isActive
                          ? {
                              backgroundColor: "#E6F4EA",
                              color: "#22C55E",
                              fontWeight: "600",
                            }
                          : {
                              backgroundColor: "transparent",
                              color: "#6B7280",
                              fontWeight: "400",
                            }
                      }
                    >
                      <span
                        className={`menu-icon ${item.iconClass}`}
                        style={{
                          fontSize: 20,
                          color: isActive ? "#22C55E" : "#6B7280",
                          minWidth: 20,
                        }}
                      />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
      )}
    </>
  );
}
