import { useState } from 'react';
import Modal from '../../components/Modal';
import '../../assets/styles/student.scss';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../../components/Avatar';
import { ModalUserInfo } from './ModalUserInfo';
import { UserHeader } from '../../components/UserHeader';
import { PackagesView } from '../Students/Packages';
import AvailabilityView from '../Tutors/Availiability/Content';

const ModalEditAvailability = ({ user, onDismiss, visible }) => {
  const [t, i18n] = useTranslation('translation');

  return (
    <ModalUserInfo
      title={t('edit_availability')}
      visible={visible}
      user={user}
      onDismiss={onDismiss}
    >
      <div className="scroll-layout">
        <UserHeader user={user} onAction={onDismiss} />
        <div className="availability-layout">
          <AvailabilityView isAdmin={true} user_id={user.id} />
        </div>
      </div>
    </ModalUserInfo>
  );
};

export default ModalEditAvailability;
