import type { IconType } from 'react-icons';

export const ModalConfirm = ({
  icon,
  title,
  text,
  btns,
}: {
  icon: IconType;
  title: string;
  text: string;
  btns: JSX.Element;
}) => {
  return (
    <div className="w-[336px] m-auto">
      {icon}
      <h2 className="text-center text-[22px] font-bold mb-4">{title}</h2>
      <div className="text-center text-[15px] font-normal mb-6">{text}</div>

      {btns}
    </div>
  );
};
