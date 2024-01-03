// import '../../../assets/styles/availability.scss';
import Layout from '../../../components/Layout';
import { AcceptingStudents } from './AcceptingStudents';
import Availability from './Availability';

const AvailiabilityLayout = () => {
  return (
    <Layout>
      <div className="pb-8">
        <Availability />
        <div className="divider"></div>
        <AcceptingStudents />
      </div>
    </Layout>
  );
};

export default AvailiabilityLayout;
