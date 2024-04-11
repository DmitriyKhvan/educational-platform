import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/modules/auth';
import { Link } from 'react-router-dom';
import { FaRegUser } from 'react-icons/fa6';
import { AdaptiveDialog } from '../AdaptiveDialog';
import { MdAddCircleOutline } from 'react-icons/md';
import SelectProfile from '../SelectProfile';
import { FiLogOut } from 'react-icons/fi';
import { Roles } from 'src/constants/global';

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
                Add/Switch profile
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
