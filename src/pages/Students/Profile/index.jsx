import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { Switch, useRouteMatch, Route } from 'react-router-dom';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../modules/auth';
import StudentProfile from './profile/StudentProfile';
import EditTopics from './editTopics/EditTopics';
import EditProflileStudent from './editInfo/EditStudentProfile';

export const Profile = () => {
  let { path } = useRouteMatch();
  const { user } = useAuth();

  return (
    <Layout>
      <Switch>
        <Route exact path={`${path}`}>
          <StudentProfile currentUser={user} isAdmin={false} />
        </Route>
        <Route path={`${path}/edit-topics`}>
          <EditTopics />
        </Route>

        <Route path={`${path}/edit-information`}>
          <EditProflileStudent />
        </Route>
      </Switch>
    </Layout>
  );
};

export default Profile;
