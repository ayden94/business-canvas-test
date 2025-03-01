import { createRef, MouseEvent, useEffect } from 'react';
import { DialogStore } from '../../../components/Dialog/DialogStore';

export const useDialogWrapperHandler = () => {
  const closeDialog = () => (DialogStore.store = undefined);

  const dialogRef = createRef<HTMLDialogElement>();

  const handleLightDismiss = (e: MouseEvent) => {
    if ((e.target as HTMLDialogElement).nodeName === 'DIALOG') closeDialog();
  };

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    dialog.showModal();
    return () => dialog.close();
  }, [dialogRef]);

  return { closeDialog, handleLightDismiss, dialogRef };
};
