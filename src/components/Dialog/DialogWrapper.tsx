import { ReactElement, useEffect, useState } from 'react';
import { DialogStore } from './DialogStore';
import Dialog from './Dialog';

export function DialogWrapper({ children }: { children: ReactElement | ReactElement[] }) {
  const [_, renderingTrigger] = useState(false);

  useEffect(() => {
    const handleStoreChange = () => {
      renderingTrigger((prev) => !prev);
    };

    DialogStore.addListener(handleStoreChange);
    return () => DialogStore.removeListener(handleStoreChange);
  }, []);

  return (
    <>
      {children}
      {DialogStore.store && <Dialog />}
    </>
  );
}
