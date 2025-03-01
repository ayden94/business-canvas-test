import { MdClose } from '@react-icons/all-files/md/MdClose';
import { Button } from 'antd';
import { createRef, MouseEvent, ReactNode, useContext, useEffect } from 'react';
import { DialogStore } from './DialogStore';
import { DialogContext } from '../../hooks/Contexts/useDialogContext';

export default function Dialog({}: {}) {
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

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-[rgba(33, 33, 33, 0.4)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-[8px]"
      onClick={handleLightDismiss}
    >
      <DialogContext.Provider value={{ closeDialog }}>
        <>{DialogStore.store}</>
      </DialogContext.Provider>
    </dialog>
  );
}

Dialog.Title = ({ title }: { title: string }) => {
  const { closeDialog } = useContext(DialogContext);

  return (
    <div className="flex items-center justify-between border-b-1 border-b-gray-100 px-16 py-12">
      <span className="text-[14px]/[22px] font-semibold">{title}</span>
      <button onClick={closeDialog} className="text-black/45">
        <MdClose />
      </button>
    </div>
  );
};

Dialog.Footer = ({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick: (e: MouseEvent) => void;
}) => {
  const { closeDialog } = useContext(DialogContext);

  return (
    <div className="flex flex-row-reverse gap-8 border-t-1 border-t-black/6 bg-black/6 px-16 py-12">
      <Button
        type="primary"
        onClick={(e) => {
          onClick(e);

          closeDialog();
        }}
        disabled={disabled}
      >
        {children}
      </Button>

      <Button htmlType="button" onClick={closeDialog}>
        취소
      </Button>
    </div>
  );
};
