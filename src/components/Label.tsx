type LabelProps = {
  children: string;
  required?: boolean;
  htmlFor: string;
  className?: string;
};

export default function Label({ children, required, htmlFor, className }: LabelProps) {
  return (
    <label className={className} htmlFor={htmlFor}>
      <span className="text-base/24 font-semibold text-black/45">{children}</span>

      {required && <span className="text-red-400"> *</span>}
    </label>
  );
}
