import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { Switch, useRouteMatch, Route } from 'react-router-dom';
import Layout from '../../../layouts/DashboardLayout';
import { useAuth } from '../../../modules/auth';
import StudentProfile from './profile/StudentProfile';
import EditTopics from './editTopics/EditTopics';

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
      </Switch>
    </Layout>
  );
};

export default Profile;
