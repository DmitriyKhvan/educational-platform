import { Suspense } from 'react';
import { Link, Outlet } from 'react-router-dom';

import Logo from 'src/shared/assets/images/logo_purple.svg';
import Loader from 'src/components/Loader/Loader';
import { LangCurrencySwitcher } from 'src/widgets/LangCurrencySwitcher';

export const OnboardingLayout = () => {
  return (
    <div className="flex flex-col relative items-center overflow-hidden">
      <header className="flex items-center justify-between w-screen h-[60px] sm:h-[96px] px-5 py-[10px] sm:px-[80px] sm:py-[16px] sm:border-b-[1px] border-color-border-grey">
        <Link
          className="flex items-center h-[79px]"
          to="/student/manage-lessons"
        >
          <img
            className="w-[134px] sm:w-[161px]"
            src={Logo}
            alt="naonow-logo"
          />
        </Link>

        <div>
          <LangCurrencySwitcher align="end" />
        </div>
      </header>
      <main className="relative overflow-auto w-screen h-[calc(100dvh-60px)] sm:h-[calc(100dvh-97px)] px-5 sm:px-20 py-6 sm:py-8 lg:py-10">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-full w-full">
              <Loader />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};
