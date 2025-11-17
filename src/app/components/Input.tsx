interface InputProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // añadido
}

export function Input({ name, label, value, onChange, onBlur }: InputProps) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur} // pasa onBlur si existe
        className="form-control"
      />
    </div>
  );
}