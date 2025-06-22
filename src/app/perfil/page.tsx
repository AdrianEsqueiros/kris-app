import React from "react";

export default function Perfil() {
  return (
    <div
      className="bg-white rounded-md shadow-sm p-8 mt-8 mx-auto"
      style={{ maxWidth: 1200 }}
    >
      <h2 className="text-2xl font-semibold text-center mb-8 border-b pb-4">
        MI PERFIL
      </h2>
      <form className="max-w-3xl mx-auto">
        <div className="mb-4">
          <label className="block text-gray-600 mb-2" htmlFor="usuario">
            USUARIO
          </label>
          <input
            id="usuario"
            type="text"
            className="form-control"
            value="juan"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2" htmlFor="email">
            EMAIL
          </label>
          <input
            id="email"
            type="email"
            className="form-control bg-gray-100"
            value="juan@gmail.com"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2" htmlFor="clave-actual">
            CLAVE ACTUAL
          </label>
          <div className="input-group">
            <input
              id="clave-actual"
              type="password"
              className="form-control"
              placeholder=".........."
            />
            <span className="input-group-text">
              <i className="bi bi-eye-slash"></i>
            </span>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2" htmlFor="nueva-clave">
            NUEVA CLAVE
          </label>
          <div className="input-group">
            <input
              id="nueva-clave"
              type="password"
              className="form-control"
              placeholder=".........."
            />
            <span className="input-group-text">
              <i className="bi bi-eye-slash"></i>
            </span>
          </div>
        </div>
        <div className="mb-8">
          <label className="block text-gray-600 mb-2" htmlFor="repetir-clave">
            REPETIR NUEVA CLAVE
          </label>
          <div className="input-group">
            <input
              id="repetir-clave"
              type="password"
              className="form-control"
              placeholder=".........."
            />
            <span className="input-group-text">
              <i className="bi bi-eye-slash"></i>
            </span>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="btn btn-primary px-5 py-2 rounded-pill"
            style={{ background: "#3B5BA9", border: "none" }}
          >
            Actualizar mis datos
          </button>
        </div>
      </form>
    </div>
  );
}
