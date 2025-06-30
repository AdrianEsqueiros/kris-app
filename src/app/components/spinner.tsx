import React from "react";

export default function Spinner() {
  return (
    <div className="h-screen flex justify-center items-center ">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid">
        {/* También puedes usar un ícono aquí si lo prefieres */}
      </div>
    </div>
  );
}
