import { gql } from '@apollo/client';

export const GENERATE_REFERRAL_LINK = gql`
  mutation generateReferralLink($studentId: ID!) {
    generateReferralLink(studentId: $studentId) {
      id
      code
      referralUrl
      promoterStudentId
      createdAt
      updatedAt
    }
  }
`;

export const VALIDATE_REFERRAL_CODE = gql`
  query validateReferralCode($referralCode: String!) {
    validateReferralCode(referralCode: $referralCode) {
      isValid
      student {
        id
        firstName
        lastName
      }
    }
  }
`;
