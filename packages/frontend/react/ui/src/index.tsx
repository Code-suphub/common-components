import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, disabled, type = "button", className = "", children, ...props },
  ref,
) {
  return <button ref={ref} type={type} className={`cc-button cc-button--${variant} cc-button--${size} ${className}`.trim()} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
    {loading && <Spinner size="sm" label="加载中" />}{children}
  </button>;
});

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> { invalid?: boolean }
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className = "", invalid, id, ...props }, ref) {
  const field = useField();
  return <input ref={ref} id={id ?? field?.id} className={`cc-input ${className}`.trim()} aria-invalid={invalid || props["aria-invalid"] || undefined} {...props} />;
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { invalid?: boolean }
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className = "", invalid, id, ...props }, ref) {
  const field = useField();
  return <textarea ref={ref} id={id ?? field?.id} className={`cc-textarea ${className}`.trim()} aria-invalid={invalid || props["aria-invalid"] || undefined} {...props} />;
});

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Checkbox({ className = "", type: _type, id, ...props }, ref) {
  const field = useField();
  return <input ref={ref} id={id ?? field?.id} type="checkbox" className={`cc-checkbox ${className}`.trim()} {...props} />;
});

export const Switch = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Switch({ className = "", type: _type, role: _role, id, ...props }, ref) {
  const field = useField();
  return <input ref={ref} id={id ?? field?.id} type="checkbox" role="switch" className={`cc-switch ${className}`.trim()} {...props} />;
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> { variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger" }
export function Badge({ variant = "default", className = "", ...props }: BadgeProps) {
  return <span className={`cc-badge cc-badge--${variant} ${className}`.trim()} {...props} />;
}

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <section className={`cc-card ${className}`.trim()} {...props} />;
}
export function CardHeader({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <header className={`cc-card__header ${className}`.trim()} {...props} />;
}
export function CardTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`cc-card__title ${className}`.trim()} {...props} />;
}
export function CardDescription({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`cc-card__description ${className}`.trim()} {...props} />;
}
export function CardContent({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`cc-card__content ${className}`.trim()} {...props} />;
}
export function CardFooter({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <footer className={`cc-card__footer ${className}`.trim()} {...props} />;
}

interface FieldContextValue { id: string; descriptionId: string; errorId: string }
const FieldContext = createContext<FieldContextValue | null>(null);
function useField() { return useContext(FieldContext); }
export function Field({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  const id = useId();
  return <FieldContext.Provider value={{ id, descriptionId: `${id}-description`, errorId: `${id}-error` }}><div className={`cc-field ${className}`.trim()} {...props} /></FieldContext.Provider>;
}
export function FieldLabel({ className = "", htmlFor, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  const field = useField();
  return <label htmlFor={htmlFor ?? field?.id} className={`cc-field__label ${className}`.trim()} {...props} />;
}
export function FieldDescription({ className = "", id, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  const field = useField();
  return <p id={id ?? field?.descriptionId} className={`cc-field__description ${className}`.trim()} {...props} />;
}
export function FieldError({ className = "", id, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  const field = useField();
  return <p id={id ?? field?.errorId} role="alert" className={`cc-field__error ${className}`.trim()} {...props} />;
}

export function Separator({ className = "", orientation = "horizontal", decorative = true, ...props }: HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical"; decorative?: boolean }) {
  return <div role={decorative ? "none" : "separator"} aria-orientation={decorative ? undefined : orientation} data-orientation={orientation} className={`cc-separator cc-separator--${orientation} ${className}`.trim()} {...props} />;
}

export function Spinner({ size = "md", label = "加载中", className = "" }: { size?: "sm" | "md" | "lg"; label?: string; className?: string }) {
  return <span className={`cc-spinner cc-spinner--${size} ${className}`.trim()} role="status"><span className="cc-visually-hidden">{label}</span></span>;
}

export function Skeleton({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={`cc-skeleton ${className}`.trim()} {...props} />;
}

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  closeLabel?: string;
}
export function Dialog({ open, onOpenChange, title, description, children, className = "", closeLabel = "关闭对话框" }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return <dialog ref={ref} className={`cc-dialog ${className}`.trim()} aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} onClose={() => onOpenChange(false)} onCancel={(event) => { event.preventDefault(); onOpenChange(false); }}>
    <div className="cc-dialog__header"><div><h2 id={titleId} className="cc-dialog__title">{title}</h2>{description && <p id={descriptionId} className="cc-dialog__description">{description}</p>}</div><button type="button" className="cc-dialog__close" aria-label={closeLabel} onClick={() => onOpenChange(false)}>×</button></div>
    <div className="cc-dialog__body">{children}</div>
  </dialog>;
}
