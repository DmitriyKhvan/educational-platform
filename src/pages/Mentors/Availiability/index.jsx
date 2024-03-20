// import '../../../assets/styles/availability.scss';
import Layout from '../../../layouts/DashboardLayout';
import { AcceptingStudents } from './AcceptingStudents';
import Availability from './Availability';
import { AvailabilityExceptions } from '../AvailabilityExceptions/AvailabilityExceptions';

const AvailiabilityLayout = () => {
  return (
    <Layout>
      <div className="pb-8">
        <Availability />
        <div className="divider"></div>
        <AcceptingStudents />
        <div className="divider"></div>
        <AvailabilityExceptions />
      </div>
    </Layout>
  );
};

export default AvailiabilityLayout;
