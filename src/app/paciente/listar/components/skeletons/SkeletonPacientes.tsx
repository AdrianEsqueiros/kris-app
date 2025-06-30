// components/skeletons/SkeletonPacientes.tsx
import React from "react";

export default function SkeletonPacientes() {
  return (
    <div
      className="bg-white rounded-md shadow-sm p-4 mt-5 mx-auto animate-pulse"
      style={{ maxWidth: 1400 }}
    >
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-6 mx-auto" />
      <div className="d-flex justify-content-end mb-3">
        <div className="bg-gray-200 rounded h-9" style={{ width: 300 }}></div>
      </div>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>NOMBRE</th>
              <th>APELLIDO</th>
              <th>SEXO</th>
              <th>PESO</th>
              <th>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {Array.from({ length: 6 }).map((__, colIdx) => (
                  <td key={colIdx}>
                    <div className="h-4 bg-gray-200 rounded w-full my-2" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-center mt-3 gap-2">
        <div className="btn btn-secondary btn-sm disabled">Anterior</div>
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="btn btn-secondary btn-sm disabled">Siguiente</div>
      </div>
    </div>
  );
}
