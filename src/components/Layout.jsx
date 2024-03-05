import { useState } from 'react';
import Navbar from './Navbar/Navbar';
import Sidebar from './Sidebar/Sidebar';
import '../assets/styles/layout.scss';

const Layout = ({ children }) => {
  const [isShowSidebar, setShowSidebar] = useState(false);

  return (
    <div className="relative">
      <div className="content flex flex-col-reverse lg:flex-row">
        {isShowSidebar && (
          <div
            className="mobile-fade-background z-50"
            onClick={() => setShowSidebar(false)}
          />
        )}
        <div>
          <Sidebar
            isShowSidebar={isShowSidebar}
            setShowSidebar={setShowSidebar}
          />
        </div>

        <div className="grow">
          <Navbar setShowSidebar={setShowSidebar} />
          <div className="overflow-auto h-[calc(100vh-2*80px)] lg:h-[calc(100vh-80px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
