import { SheduleSelectorContext } from './SheduleSelectorContext';

export const SheduleSelectorProvider = ({
  duration,
  selectedTutor,
  children,
}) => {
  return (
    <SheduleSelectorContext.Provider value={{ duration, selectedTutor }}>
      {children}
    </SheduleSelectorContext.Provider>
  );
};
