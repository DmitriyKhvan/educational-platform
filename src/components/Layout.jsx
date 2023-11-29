import React, { useState } from 'react';
import Navbar from './Navbar/Navbar';
import Sidebar from './Sidebar';
import '../assets/styles/layout.scss';

const Layout = ({ children }) => {
  const [isShowSidebar, setShowSidebar] = useState(false);

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
            <div className="h-[calc(100vh-80px)] overflow-auto">{children}</div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
      {/* </Elements> */}
    </>
  );
};

export default Layout;
