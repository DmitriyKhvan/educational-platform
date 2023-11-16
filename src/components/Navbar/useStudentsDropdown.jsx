import React from 'react';
import { HiUserCircle } from 'react-icons/hi2';
import { MdAddCircleOutline } from 'react-icons/md';
import { Link } from 'react-router-dom';
import {
  getItemToLocalStorage,
  setItemToLocalStorage,
} from 'src/constants/global';
import { useAuth } from 'src/modules/auth';

export const useStudentsDropdown = () => {
  const { user } = useAuth();

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
        customIcon: HiUserCircle,
        activeIcon: student?.avatar?.url,
        isActive: student.isActive,
        onClick: () =>
          student.isActive ? onChangeStudentProfile(student) : undefined,
      };
    });

  studentList.push({
    label: 'Add Account',
    href: '/add-student-profile',
    isActive: true,
    customIcon: MdAddCircleOutline,
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

        {item.activeIcon ? (
          <span>
            <img
              className="w-[30px] h-[30px] rounded-full border-2 border-color-white object-center object-cover"
              src={item.activeIcon}
              alt=""
            />
          </span>
        ) : (
          <item.customIcon className="text-[30px] text-color-purple transition ease-in-out delay-150 group-hover:text-white" />
        )}
      </Link>
    );
  };

  return {
    studentsRender,
    studentList,
  };
};
