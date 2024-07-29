import { useTranslation } from 'react-i18next';

import { FaRegCircleCheck } from 'react-icons/fa6';

const images = import.meta.glob('@/shared/assets/images/samples/*.jpg', {
  eager: true,
  as: 'url',
});

const SampleModal = () => {
  const [t] = useTranslation('profile');
  const sampleInfo = [
    {
      id: 1,
      text: t('tip1'),
    },
    {
      id: 2,
      text: t('tip2'),
    },
    {
      id: 3,
      text: t('tip3'),
    },
    {
      id: 4,
      text: t('tip4'),
    },
    {
      id: 5,
      text: t('tip5'),
    },
    {
      id: 6,
      text: t('tip6'),
    },
    {
      id: 7,
      text: t('tip7'),
    },
  ];

  return (
    <div className="sm:flex">
      <div className="border-b sm:border-r border-solid border-color-border-grey w-full sm:w-1/2">
        <section className="border-b border-solid border-color-border-grey">
          <h2 className="p-[30px] font-semibold text-2xl leading-[29px] tracking-[-0.7px] text-color-purple">
            {t('photo_tips')}
          </h2>
        </section>
        <section className="flex p-[30px]">
          <div className="flex justify-between gap-y-[20px] flex-wrap w-[350px]">
            {Object.values(images).map((item, idx) => (
              <img className="w-[100px] h-[100px]" key={idx} src={item} alt="" />
            ))}
          </div>
        </section>
      </div>

      <div className="w-full sm:w-1/2">
        <ul className="py-6 px-[30px]">
          {sampleInfo.map((item) => (
            <li className="flex my-4 items-center gap-[10px]" key={item.id}>
              <FaRegCircleCheck className="text-2xl text-color-purple" />
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SampleModal;
