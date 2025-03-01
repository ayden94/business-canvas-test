import { useContext, useEffect } from 'react';
import { DialogContext } from '../../Contexts/useDialogContext';

export const useDialogFormHandler = <T extends Record<string, unknown>>({
  disabled,
  formValue,
  disabledDependencyProps,
}: {
  disabled: boolean;
  formValue: T;
  disabledDependencyProps: unknown[];
}) => {
  const { setDisabled, setFormValues } = useContext(DialogContext);

  useEffect(() => {
    if (setDisabled) {
      setDisabled(disabled);
    }
    if (setFormValues) {
      setFormValues(formValue);
    }
  }, [...disabledDependencyProps, formValue]);
};
