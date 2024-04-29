import React from 'react';
import { AdaptiveDialog } from './AdaptiveDialog';
import { ModalPurchase } from './ModalPurchase';
import { useAuth } from 'src/modules/auth';

export const StudentTriggerAction = ({
  trialStudentAction,
  studentAction,
  condition,
}) => {
  const { currentStudent } = useAuth();

  const defaultCondition =
    condition !== undefined ? condition : currentStudent?.isTrial;

  return (
    <>
      {defaultCondition ? (
        <AdaptiveDialog button={trialStudentAction}>
          <ModalPurchase />
        </AdaptiveDialog>
      ) : (
        studentAction
      )}
    </>
  );
};
