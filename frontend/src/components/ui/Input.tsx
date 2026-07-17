import { forwardRef, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

interface FieldWrapperProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

// Consistent label + error layout shared by all form fields.
export function Field({ label, error, children }: FieldWrapperProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

const baseControl =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = "", ...props },
  ref
) {
  return (
    <Field label={label} error={error}>
      <input ref={ref} className={`${baseControl} ${className}`} {...props} />
    </Field>
  );
});

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className = "", ...props },
  ref
) {
  return (
    <Field label={label} error={error}>
      <textarea ref={ref} className={`${baseControl} ${className}`} rows={3} {...props} />
    </Field>
  );
});

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, className = "", children, ...props },
  ref
) {
  return (
    <Field label={label} error={error}>
      <select ref={ref} className={`${baseControl} ${className}`} {...props}>
        {children}
      </select>
    </Field>
  );
});
