import React from 'react';
import { useAuth } from 'src/modules/auth';
import { AdaptiveDialog } from './AdaptiveDialog';
import { ModalPurchase } from './ModalPurchase';

export const StudentTriggerAction = ({ trialStudentAction, studentAction }) => {
  const { currentStudent } = useAuth();
  return (
    <>
      {currentStudent?.isTrial ? (
        <AdaptiveDialog button={trialStudentAction}>
          <ModalPurchase />
        </AdaptiveDialog>
      ) : (
        studentAction
      )}
    </>
  );
};
