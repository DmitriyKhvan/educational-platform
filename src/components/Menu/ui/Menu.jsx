import { useMenuList } from '../lib/useMenuList';
import { MenuItem } from './MenuItem';

export const Menu = () => {
  const navLinks = useMenuList();

  return (
    <ul className="flex flex-col gap-[10px] pt-10 pb-12">
      {navLinks?.map((menu) => {
        return <MenuItem key={menu.link} menu={menu} />;
      })}
    </ul>
  );
};
