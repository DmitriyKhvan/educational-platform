import React from 'react';

import cls from './Sample.module.scss';

import PlaceImg from '../../../assets/Placeholder.png';
import Modal from 'react-modal';
import Check from '../../../assets/check.png';
import { useTranslation } from 'react-i18next';

const SampleModal = ({ isOpen, closeModal }) => {
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
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="edit-profile-modal-overlay"
      className={cls.sample_modal}
      bodyOpenClassName={'edit-modal-open'}
    >
      <div className={cls.sample_card}>
        <div className={cls.sample_card_row}>
          <div className={cls.sample_card_row_left}>
            <section className={cls.sample_card_row_left_title}>
              <h2>{t('photo_tips')}</h2>
            </section>
            <section className={cls.sample_types_row}>
              <div>
                {Array.from({ length: 6 }).map((item) => (
                  <img src={PlaceImg} alt="" />
                ))}
              </div>
            </section>
          </div>
          <div className={cls.sample_card_row_right}>
            <span onClick={closeModal}>&times;</span>
            <ul>
              {sampleInfo.map((item) => (
                <li>
                  <img src={Check} alt="" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SampleModal;
