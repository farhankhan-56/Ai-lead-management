import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-ink shadow-card hover:-translate-y-0.5 hover:shadow-glow",
  secondary:
    "border border-line-strong bg-raised text-fg shadow-card hover:-translate-y-0.5 hover:border-fg-faint",
  danger: "border border-high/30 bg-high/15 text-high hover:-translate-y-0.5 hover:bg-high/25",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant };

export function Button({ variant = "primary", type = "button", className = "", ...rest }: ButtonProps) {
  return <button type={type} className={`${BASE} ${VARIANT_STYLES[variant]} ${className}`} {...rest} />;
}