export const customizeRequiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
  <>
    {label}
    {required && <span className="text-red-500">*</span>}
  </>
);