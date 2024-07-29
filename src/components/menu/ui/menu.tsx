import { useMenuList } from '@/components/menu/lib/use-menuList';
import { MenuItem } from '@/components/menu/ui/menu-item';

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
