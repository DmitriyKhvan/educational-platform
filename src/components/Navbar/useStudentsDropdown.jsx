import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdAddCircleOutline } from 'react-icons/md';
import { Link } from 'react-router-dom';
import {
  getItemToLocalStorage,
  setItemToLocalStorage,
} from 'src/constants/global';
import { useAuth } from 'src/modules/auth';
import { Avatar } from 'src/widgets/Avatar/Avatar';

export const useStudentsDropdown = () => {
  const [t] = useTranslation('profile');
  const { user, currentStudent } = useAuth();

  const onChangeStudentProfile = (student) => {
    setItemToLocalStorage('studentId', student.id);
    setItemToLocalStorage('token', student.newToken);
    window.location.reload(true);
  };

  const studentList = user.students
    .filter((student) => student.id !== getItemToLocalStorage('studentId'))
    .map((student) => {
      return {
        label: student.firstName,
        activeIcon: (
          <Avatar
            fallback="duck"
            avatarUrl={student?.avatar?.url}
            className="w-[25px] h-[25px] mr-[3px] rounded-full bg-color-purple group-hover:bg-white transition ease-in-out delay-150"
          />
        ),
        isActive: student.isActive,
        onClick: () =>
          student.isActive ? onChangeStudentProfile(student) : undefined,
      };
    });

  studentList.push({
    label: t('add_account'),
    href: currentStudent?.isTrial ? '/trial' : '/add-student-profile',
    isActive: true,
    activeIcon: (
      <MdAddCircleOutline className="text-[30px] text-color-purple transition ease-in-out delay-150 group-hover:text-white" />
    ),
  });

  const studentsRender = (item, index, active, setActive, setVisible) => {
    return (
      <Link
        key={item.label}
        to={item.href || '#'}
        className={`flex items-center justify-between px-[15px] py-[7px] font-semibold text-[15px] ${
          item.isActive
            ? 'cursor-pointer transition ease-in-out delay-150 group hover:bg-color-purple'
            : 'cursor-no-drop grayscale-[70%] opacity-50'
        }`}
        onClick={() => {
          setActive(index);
          item.isActive ? setVisible(false) : undefined;
          if (item.onClick) {
            item.onClick(index);
          }
        }}
      >
        <span className="w-3/4 truncate transition ease-in-out delay-150 group-hover:text-white">
          {item.label}
        </span>

        {item.activeIcon}
      </Link>
    );
  };

  return {
    studentsRender,
    studentList,
  };
};
