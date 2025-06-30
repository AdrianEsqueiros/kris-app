import { useState } from "react";

export default function PasswordInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Clave</label>
      <div className="relative mt-1">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={value}
          onChange={onChange}
          required
          className="block w-full border border-gray-300 rounded-md p-2 pr-10"
          placeholder=""
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
        >
          <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
        </button>
      </div>
    </div>
  );
}
