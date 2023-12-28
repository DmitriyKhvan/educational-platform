// import '../../../assets/styles/availability.scss';
import Layout from '../../../components/Layout';
import Availability from './Availability';
import { AvailabilityExceptions } from './AvailabilityExceptions';

const AvailiabilityLayout = () => {
  return (
    <Layout>
      <Availability />
      <div className="divider"></div>
      <AvailabilityExceptions />
    </Layout>
  );
};

export default AvailiabilityLayout;
