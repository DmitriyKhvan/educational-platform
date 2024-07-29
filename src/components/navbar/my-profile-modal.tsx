import { useAuth } from '@/app/providers/auth-provider';
import SelectProfile from '@/components/select-profile/select-profile';
import { Roles } from '@/shared/constants/global';
import { AdaptiveDialog } from '@/shared/ui/adaptive-dialog';
import { useTranslation } from 'react-i18next';
import { FaRegUser } from 'react-icons/fa6';
import { FiLogOut } from 'react-icons/fi';
import { MdAddCircleOutline } from 'react-icons/md';
import { Link } from 'react-router-dom';

const MyProfileModal = () => {
  const [t] = useTranslation('common');
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.Intercom('shutdown');
    window.location.reload(true);
  };

  return (
    <div>
      <Link
        to={user.role === Roles.MENTOR ? '/mentor/profile' : '/student/profile'}
        className={`flex items-center space-x-3 px-[16px] py-[18px] font-semibold text-[15px] border-b cursor-pointer transition ease-in-out delay-150 group hover:bg-color-purple`}
      >
        <FaRegUser className="text-[20px] transition ease-in-out delay-150 group-hover:text-white" />
        <span className="w-3/4 truncate transition ease-in-out delay-150 group-hover:text-white text-sm">
          {t('my_profile')}
        </span>
      </Link>

      {user.role === Roles.STUDENT && (
        <AdaptiveDialog
          classNameDrawer="max-h-[100dvh]"
          button={
            <button
              className={`w-full flex items-center space-x-3 px-[16px] py-[18px] border-b font-semibold text-[15px] cursor-pointer transition ease-in-out delay-150 group hover:bg-color-purple`}
              type="button"
            >
              <MdAddCircleOutline className="text-[20px] text-color-purple transition ease-in-out delay-150 group-hover:text-white" />{' '}
              <span className="w-3/4 text-left  text-sm text-color-purple truncate transition ease-in-out delay-150 group-hover:text-white">
                {t('add_switch_profile')}
              </span>
            </button>
          }
        >
          <SelectProfile />
        </AdaptiveDialog>
      )}

      <button
        className={`w-full flex items-center space-x-3 px-[16px] py-[18px] font-semibold text-[15px] cursor-pointer transition ease-in-out delay-150 group hover:bg-color-red`}
        type="button"
        onClick={handleLogout}
      >
        <FiLogOut className="text-[20px] text-color-red transition ease-in-out delay-150 group-hover:text-white" />
        <span className="w-3/4 text-left  text-sm text-color-red truncate transition ease-in-out delay-150 group-hover:text-white">
          {t('logout')}
        </span>
      </button>
    </div>
  );
};

export default MyProfileModal;
