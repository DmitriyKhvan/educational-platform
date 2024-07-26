import { gql } from "@apollo/client";

export const GET_LESSON_SECTIONS = gql`
  query lessonSections($topicId: ID) {
    lessonSections(topicId: $topicId) {
      id
      title
      description
      completed
    }
  }
`;
