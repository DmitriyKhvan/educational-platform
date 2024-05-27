import { gql } from '@apollo/client';

export const CHANGE_STUDENT_LEVEL = gql`
  mutation changeStudentLanguageLevel($studentId: ID!, $languageLevelId: Int!) {
    changeStudentLanguageLevel(
      studentId: $studentId
      languageLevelId: $languageLevelId
    ) {
      id
      firstName
      lastName
      languageLevel {
        id
        title
      }
    }
  }
`;
