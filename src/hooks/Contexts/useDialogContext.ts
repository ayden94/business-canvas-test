import { createContext, Dispatch, SetStateAction } from 'react';

export const DialogContext = createContext<{
  closeDialog?: () => void;
  disabled?: boolean;
  setDisabled?: Dispatch<SetStateAction<boolean>>;
  formValues?: Record<string, unknown>;
  setFormValues?: Dispatch<SetStateAction<Record<string, unknown>>>;
}>({});
