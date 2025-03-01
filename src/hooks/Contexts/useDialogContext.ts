import { createContext } from 'react';

export const DialogContext = createContext<{ closeDialog: () => void }>({ closeDialog: () => {} });
