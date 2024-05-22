import Navbar from '../components/Navbar/Navbar';
import { Sidebar } from '../components/Sidebar';
import '../assets/styles/layout.scss';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="relative">
      <div className="content flex flex-col-reverse lg:flex-row">
        <div>
          <Sidebar />
        </div>

        <div className="grow">
          <Navbar />
          <div className="overflow-auto h-[calc(100dvh-80px-64px)] sm:h-[calc(100dvh-2*80px)] lg:h-[calc(100dvh-80px)] p-5 sm:px-10 sm:py-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
