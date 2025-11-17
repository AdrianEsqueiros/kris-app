import React, { useState } from "react";

interface Props {
  name: string;
  value: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  autoComplete?: string;
  disabled?: boolean;
}

export default function PasswordInput({
  name,
  value,
  label,
  onChange,
  onBlur,
  autoComplete,
  disabled = false,
}: Props) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          disabled={disabled}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 pr-10"
          placeholder={label}
        />
        <button
          type="button"
            tabIndex={-1}
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
        >
          {show ? <i className="bi bi-eye-slash" /> : <i className="bi bi-eye" />}
        </button>
      </div>
    </div>
  );
}