"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPasswordAws, confirmForgotPasswordAws } from '../lib/cognito-aws';

const RecoveryPasswordPage = () => {
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await forgotPasswordAws(email);
      setStep('code');
      setSuccess('Se ha enviado un código a tu correo electrónico.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al enviar el código.');
      } else {
        setError('Error al enviar el código.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await confirmForgotPasswordAws(email, code, newPassword);
      setStep('success');
      setSuccess('¡Contraseña restablecida correctamente!');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al restablecer la contraseña.');
      } else {
        setError('Error al restablecer la contraseña.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Recuperar contraseña</h1>
      {step === 'success' ? (
        <div className="text-green-500 text-center text-lg font-semibold py-8">
          ¡Contraseña restablecida correctamente!
        </div>
      ) : (
        <>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          {success && <div className="text-green-500 mb-2">{success}</div>}
          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit}>
              <label className="block mb-2">Correo electrónico</label>
              <input
                type="email"
                className="w-full p-2 border rounded mb-4"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar código'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit}>
              <label className="block mb-2">Código de verificación</label>
              <input
                type="text"
                className="w-full p-2 border rounded mb-4"
                value={code}
                onChange={e => setCode(e.target.value)}
                required
              />
              <label className="block mb-2">Nueva contraseña</label>
              <input
                type="password"
                className="w-full p-2 border rounded mb-4"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
              </button>
            </form>
          )}
        </>
      )}
  </div>  
    </div>
  );
};

export default RecoveryPasswordPage;
