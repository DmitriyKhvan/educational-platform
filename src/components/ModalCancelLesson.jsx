import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import Modal from './Modal';
import '../assets/styles/student.scss';
import { Checkbox } from './Checkbox';
import ImgInfo from '../assets/images/info.svg';

export const ModalCancelLesson = ({
  visible,
  reasons,
  onDismiss,
  onCancel,
  lesson,
}) => {
  const history = useHistory();
  const [t] = useTranslation('modals');
  const [checked, setChecked] = useState([]);
  const [fupdate, setFupdate] = useState(false);
  useEffect(() => {
    const checked = reasons.map(() => false);
    setChecked(checked);
  }, [reasons]);

  const onChange = (index) => {
    checked[index] = !checked[index];
    setChecked(checked);
    setFupdate(!fupdate);
  };

  const onSubmit = () => {
    onCancel({
      reasons: checked
        .map((checked, index) => (checked ? index : false))
        .filter((checked) => checked),
      id: lesson.id,
    });
    history.push('/mentor/appointments-calendar');
  };

  return (
    <Modal
      className="cancel-lesson-wrapper"
      visible={visible}
      onCancel={onDismiss}
    >
      <div className="title">{t('cancel_the_lesson')}</div>
      <div className="description">{t('select_reason')}</div>
      {reasons.map((clr, index) => (
        <Checkbox
          key={`checkbox-${index}`}
          label={t(clr.label)}
          onChange={() => onChange(index)}
          checked={checked[index]}
        />
      ))}
      <div className="flex align-items-center justify-content-space-between">
        <div className="info">
          <img src={ImgInfo} alt="" />
          <span>{t('learn_more_about_cancel_conditions')}</span>
          <div className="tooltip">
            <span>{t('cancel_condition_1')}</span>
            <span>{t('cancel_condition_2')}</span>
            <span>{t('cancel_condition_3')}</span>
            <span>{t('cancel_condition_4')}</span>
          </div>
        </div>
        <div className="btn" onClick={onSubmit}>
          {t('cancel_lesson')}
        </div>
      </div>
    </Modal>
  );
};
