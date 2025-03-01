import { MdClose } from '@react-icons/all-files/md/MdClose';
import { Button } from 'antd';
import { ReactNode, useContext, useState } from 'react';
import { DialogStore } from './DialogStore';
import { DialogContext } from '../../hooks/Contexts/useDialogContext';
import { useDialogWrapperHandler } from '../../hooks/useHandler/Dialog/useDialogWrapperHandler';

export default function Dialog() {
  const [disabled, setDisabled] = useState(false);
  const [formValues, setFormValues] = useState({});
  const { closeDialog, handleLightDismiss, dialogRef } = useDialogWrapperHandler();

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-[rgba(33, 33, 33, 0.4)] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-[8px]"
      onClick={handleLightDismiss}
    >
      <DialogContext.Provider
        value={{ closeDialog, disabled, setDisabled, formValues, setFormValues }}
      >
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

Dialog.Footer = <ONCLICK_DATA_TYPE extends Record<string, unknown>>({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: (data: ONCLICK_DATA_TYPE) => void;
}) => {
  const { closeDialog, disabled, formValues } = useContext(DialogContext);

  return (
    <div className="flex flex-row-reverse gap-8 border-t-1 border-t-black/6 bg-black/6 px-16 py-12">
      <Button
        type="primary"
        onClick={() => {
          if (formValues) onClick(formValues as ONCLICK_DATA_TYPE);
          if (closeDialog) closeDialog();
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
