import { gql } from '@apollo/client';

export const PLAYGROUND_LESSON = gql`
  query playgroundLesson($playgroundId: String!) {
    playgroundLesson(playgroundId: $playgroundId) {
      id
      student {
        id
        firstName
        lastName
        languageLevel {
          id
          title
        }
      }
      isTrial
      languageLevel {
        id
        title
        translations {
          title
          language
        }
      }
    }
  }
`;
