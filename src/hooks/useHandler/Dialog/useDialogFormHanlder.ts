import { useContext, useEffect } from 'react';
import { DialogContext } from '../../Contexts/useDialogContext';

export const useDialogFormHandler = (disabled: boolean, ...disabledDependencyProps: unknown[]) => {
  const { setDisabled } = useContext(DialogContext);

  useEffect(() => {
    if (setDisabled) {
      setDisabled(disabled);
    }
  }, [...disabledDependencyProps]);
};
