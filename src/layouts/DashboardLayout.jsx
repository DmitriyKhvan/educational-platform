import Navbar from '../components/Navbar/Navbar';
import { Sidebar } from '../components/Sidebar';
import '../assets/styles/layout.scss';

const Layout = ({ children }) => {
  return (
    <div className="relative">
      <div className="content flex flex-col-reverse lg:flex-row">
        <div>
          <Sidebar />
        </div>

        <div className="grow">
          <Navbar />
          <div className="overflow-auto h-[calc(100vh-80px-64px)] sm:h-[calc(100vh-2*80px)] lg:h-[calc(100vh-80px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
