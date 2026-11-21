export const FIELD_CLASS =
  "w-full rounded border border-slate-400 bg-white px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900";

type FormFieldProps = {
  name: string;
  label: string;
  defaultValue?: string;
  error?: string;
  hint?: string;
  type?: string;
  inputMode?: "numeric";
  isMultiline?: boolean;
  isRequired?: boolean;
};

export function FormField({
  name,
  label,
  defaultValue,
  error,
  hint,
  type = "text",
  inputMode,
  isMultiline,
  isRequired,
}: FormFieldProps) {
  const hintId = `${name}-hint`;
  const errorId = `${name}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;
  const sharedProps = {
    id: name,
    name,
    defaultValue,
    required: isRequired,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
    className: FIELD_CLASS,
  };

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium">
        {label}
        {isRequired && " *"}
      </label>
      {isMultiline ? (
        <textarea {...sharedProps} rows={4} />
      ) : (
        <input {...sharedProps} type={type} inputMode={inputMode} />
      )}
      {hint && (
        <p id={hintId} className="text-sm text-slate-700">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}