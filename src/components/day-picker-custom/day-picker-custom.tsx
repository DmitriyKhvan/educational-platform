import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import '@/components/day-picker-custom/day-picker.css';

export const DayPickerCustom = (props) => {
  return <DayPicker {...props} />;
};
