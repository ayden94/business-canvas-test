type FormProps = {
  children: React.ReactNode;
  className: string;
};

export default function Form({ children, className }: FormProps) {
  return (
    <form noValidate className={`${className}`}>
      {children}
    </form>
  );
}
