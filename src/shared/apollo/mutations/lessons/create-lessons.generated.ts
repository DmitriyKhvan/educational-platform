import * as Types from '../../../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateLessonsMutationVariables = Types.Exact<{
  mentorId: Types.Scalars['ID']['input'];
  studentId: Types.Scalars['ID']['input'];
  packageSubscriptionId: Types.Scalars['ID']['input'];
  startAt: Types.Scalars['DateTime']['input'];
  duration: Types.Scalars['Int']['input'];
  repeat?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type CreateLessonsMutation = { __typename?: 'Mutation', createLessons: Array<{ __typename?: 'Lesson', id: string, startAt?: any | null, duration?: number | null, status?: Types.LessonStatusType | null, cancelAction?: Types.LessonCancelActionType | null, cancelReason?: string | null, isTrial?: boolean | null, mentor?: { __typename?: 'Mentor', id: string, firstName?: string | null, lastName?: string | null, gender?: Types.GenderType | null, avatar?: { __typename?: 'File', url?: string | null } | null } | null, languageLevel?: { __typename?: 'LanguageLevel', id?: string | null, title?: string | null, translations?: Array<{ __typename?: 'LanguageLevelTranslation', id: string, title?: string | null, language?: Types.CourseTranslationsLanguage | null } | null> | null } | null, packageSubscription?: { __typename?: 'PackageSubscription', id: string, periodStart?: any | null, periodEnd?: any | null, credits?: number | null, packageId: string, modifyCredits?: number | null, paymentId?: string | null, package?: { __typename?: 'Package', course?: { __typename?: 'Course', id: string, title?: string | null, translations?: Array<{ __typename?: 'CourseTranslation', title?: string | null, language?: Types.CourseTranslationsLanguage | null } | null> | null } | null } | null } | null } | null> };


export const CreateLessonsDocument = gql`
    mutation createLessons($mentorId: ID!, $studentId: ID!, $packageSubscriptionId: ID!, $startAt: DateTime!, $duration: Int!, $repeat: Int) {
  createLessons(
    mentorId: $mentorId
    studentId: $studentId
    packageSubscriptionId: $packageSubscriptionId
    startAt: $startAt
    duration: $duration
    repeat: $repeat
  ) {
    id
    startAt
    duration
    status
    cancelAction
    cancelReason
    mentor {
      id
      firstName
      lastName
      gender
      avatar {
        url
      }
    }
    isTrial
    languageLevel {
      id
      title
      translations {
        id
        title
        language
      }
    }
    packageSubscription {
      id
      periodStart
      periodEnd
      credits
      packageId
      modifyCredits
      package {
        course {
          id
          title
          translations {
            title
            language
          }
        }
      }
      paymentId
    }
  }
}
    `;
export type CreateLessonsMutationFn = Apollo.MutationFunction<CreateLessonsMutation, CreateLessonsMutationVariables>;

/**
 * __useCreateLessonsMutation__
 *
 * To run a mutation, you first call `useCreateLessonsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLessonsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLessonsMutation, { data, loading, error }] = useCreateLessonsMutation({
 *   variables: {
 *      mentorId: // value for 'mentorId'
 *      studentId: // value for 'studentId'
 *      packageSubscriptionId: // value for 'packageSubscriptionId'
 *      startAt: // value for 'startAt'
 *      duration: // value for 'duration'
 *      repeat: // value for 'repeat'
 *   },
 * });
 */
export function useCreateLessonsMutation(baseOptions?: Apollo.MutationHookOptions<CreateLessonsMutation, CreateLessonsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateLessonsMutation, CreateLessonsMutationVariables>(CreateLessonsDocument, options);
      }
export type CreateLessonsMutationHookResult = ReturnType<typeof useCreateLessonsMutation>;
export type CreateLessonsMutationResult = Apollo.MutationResult<CreateLessonsMutation>;
export type CreateLessonsMutationOptions = Apollo.BaseMutationOptions<CreateLessonsMutation, CreateLessonsMutationVariables>;