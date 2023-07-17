import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../assets/styles/layout.scss';
// import { Elements } from '@stripe/react-stripe-js'
// import { loadStripe } from '@stripe/stripe-js'
// import io from 'socket.io-client';
// import { setNotification } from '../actions/notification';
// import { useAuth } from '../modules/auth';
// import ReferMessageModal from './ReferMessageModal';

const Layout = ({ children }) => {
  const [isShowSidebar, setShowSidebar] = useState(false);
  // const { user } = useAuth();
  // const [socket, setSocket] = useState(null);
  // const dispatch = useDispatch();
  // const [referalMessage, setReferalMessage] = React.useState(null);
  // const [showRefer, setRefer] = React.useState(false);

  // useEffect(() => {
  //   if (user) {
  //     setSocket(io.connect(process.env.REACT_APP_SERVER_URL));
  //   }
  // }, [user]);

  // useEffect(() => {
  //   if (socket) {
  //     socket.on('join', onUserJoined);
  //     socket.on('completeLesson', onCompleteLesson);
  //     socket.on('referal_confirmed', (data) => {
  //       setReferalMessage(data);
  //       setRefer(true);
  //     });
  //   }
  // }, [socket]);

  // const onCompleteLesson = (data) => {
  //   dispatch(
  //     setNotification({
  //       message: `Lesson #${data.group.group_id} is completed`,
  //       data,
  //     }),
  //   );
  // };

  // const onUserJoined = () => {
  //   socket.emit('join', user.id);
  // };

  return (
    <>
      {/* <Elements stripe={stripe}> */}
      <div className="default-layout">
        {/* {referalMessage && showRefer && (
          <ReferMessageModal
            referalMessage={referalMessage}
            setRefer={setRefer}
          />
        )} */}
        <div className="content">
          {isShowSidebar && <div className="mobile-fade-background" />}
          <Sidebar
            isShowSidebar={isShowSidebar}
            setShowSidebar={setShowSidebar}
          />
          <div className="children-page">
            <Navbar setShowSidebar={setShowSidebar} />
            <div>{children}</div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
      {/* </Elements> */}
    </>
  );
};

export default Layout;
