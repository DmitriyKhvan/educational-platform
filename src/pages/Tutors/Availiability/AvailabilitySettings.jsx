import 'rc-time-picker/assets/index.css';
import Layout from '../../../components/Layout';
import { useTranslation } from 'react-i18next';
import { Settings } from './Settings';
export const AvailabilitySettings = () => {
  const [t] = useTranslation('translation');

  return (
    <Layout>
      <Settings />
    </Layout>
  );
};

export default AvailabilitySettings;
