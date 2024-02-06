import { useContext } from 'react';
import { SheduleSelectorContext } from './SheduleSelectorContext';

export const useSheduleSelector = () => {
  return useContext(SheduleSelectorContext);
};
