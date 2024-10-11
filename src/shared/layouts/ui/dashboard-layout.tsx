import Loader from '@/components/loader/loader';
import Navbar from '@/components/navbar/navbar';
import { Sidebar } from '@/components/sidebar';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import '@/app/styles/layout.scss';
import { NotificationDialog } from '@/widgets/notification-dialog/ui/notification-dialog';

export const Layout = () => {
  return (
    <div className="relative">
      <div className="content flex flex-col-reverse lg:flex-row">
        <div>
          <Sidebar />
        </div>

        <div className="grow">
          <Navbar />
          <div className="scrollable-parent relative overflow-auto h-[calc(100dvh-80px-64px)] sm:h-[calc(100dvh-2*80px)] lg:h-[calc(100dvh-80px)] p-5 sm:px-10 sm:py-8">
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-full w-full">
                  <Loader />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </div>
      </div>
      <NotificationDialog />
    </div>
  );
};
