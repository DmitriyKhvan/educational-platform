import { Link } from 'react-router-dom';
import { Roles } from 'src/shared/constants/global';
import { useAuth } from 'src/app/providers/AuthProvider';

export default function NotFoundPage() {
  const { user } = useAuth();

  return (
    <main className="grid h-screen place-items-center bg-white py-24 px-6 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-color-purple">404</p>
        <h1 className="mt-4 text-3xl text-center font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to={
              user?.role === Roles.MENTOR
                ? '/mentor/manage-appointments'
                : '/student/manage-lessons'
            }
            className="rounded-md bg-color-purple px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-lighter focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
