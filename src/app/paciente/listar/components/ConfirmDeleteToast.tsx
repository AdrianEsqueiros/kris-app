import React from "react";

interface ToastProps {
  message: string;
  patientName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteToast: React.FC<ToastProps> = ({ message, patientName, onConfirm, onCancel }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      border: '1px solid #e53e3e',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      zIndex: 9999,
      padding: 24,
      minWidth: 320,
      textAlign: 'center',
    }}>
      <div className="mb-3 text-danger" style={{ fontWeight: 'bold' }}>
        {message}
        {patientName && (
          <div className="mt-2" style={{ fontWeight: 'normal', color: '#333' }}>
            <span>Paciente: <b>{patientName}</b></span>
          </div>
        )}
      </div>
      <button className="btn btn-danger me-2" onClick={onConfirm}>Eliminar</button>
      <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
    </div>
  );
};

export default ConfirmDeleteToast;
