import React, { useState } from 'react';
import { useMenuList } from '../../lib/useMenuList';
import { MdMoreHoriz } from 'react-icons/md';
import { MyDrawer } from '../../../Drawer';
import { MobileMenuFull } from '../MobileMenuFull';
import { MobileMenuItem } from './MobileMenuItem';
import { cn } from 'src/utils/functions';
import { useAuth } from 'src/modules/auth';
import { Roles } from 'src/constants/global';

export const MobileMenu = () => {
  const navLinks = useMenuList();
  const [open, setOpen] = useState(false);

  const { user } = useAuth();

  return (
    <div className="sticky bottom-0 left-0 flex justify-center items-center w-full h-16 sm:h-20 bg-white shadow-[4px_0px_16px_0px_rgba(0,_0,_0,_0.04)]">
      <ul
        className={cn(
          'grid w-full sm:w-auto',
          user.role === Roles.MENTOR ? 'grid-cols-4' : ' grid-cols-5',
        )}
      >
        {navLinks.slice(0, 4).map((menu) => {
          return <MobileMenuItem key={menu.link} menu={menu} />;
        })}
        <li className="grid justify-center">
          <MyDrawer
            open={open}
            setOpen={setOpen}
            button={
              <button className="group flex flex-col justify-center items-center gap-[5px] sm:w-[118px] cursor-pointer">
                <MdMoreHoriz className="text-[22px] transition ease-in-out delay-150 text-[#C0C0C3] font-medium group-hover:text-color-purple" />
                <span className="text-[13px] transition ease-in-out delay-150 text-[#C0C0C3] font-medium group-hover:text-color-purple">
                  More
                </span>
              </button>
            }
          >
            <MobileMenuFull setOpen={setOpen} />
          </MyDrawer>
        </li>
      </ul>
    </div>
  );
};
