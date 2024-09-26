import * as Types from '../../../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type RescheduleLessonsMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  startAt: Types.Scalars['DateTime']['input'];
  mentorId: Types.Scalars['ID']['input'];
  repeat?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;


export type RescheduleLessonsMutation = { __typename?: 'Mutation', rescheduleLessons: Array<{ __typename?: 'Lesson', id: string, startAt?: any | null, duration?: number | null, status?: Types.LessonStatusType | null, cancelAction?: Types.LessonCancelActionType | null, cancelReason?: string | null, packageSubscription?: { __typename?: 'PackageSubscription', id: string, periodStart?: any | null, periodEnd?: any | null, credits?: number | null, packageId: string, modifyCredits?: number | null, paymentId?: string | null, package?: { __typename?: 'Package', course?: { __typename?: 'Course', id: string, title?: string | null } | null } | null } | null } | null> };


export const RescheduleLessonsDocument = gql`
    mutation rescheduleLessons($id: ID!, $startAt: DateTime!, $mentorId: ID!, $repeat: Boolean) {
  rescheduleLessons(
    id: $id
    startAt: $startAt
    mentorId: $mentorId
    repeat: $repeat
  ) {
    id
    startAt
    duration
    status
    cancelAction
    cancelReason
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
        }
      }
      paymentId
    }
  }
}
    `;
export type RescheduleLessonsMutationFn = Apollo.MutationFunction<RescheduleLessonsMutation, RescheduleLessonsMutationVariables>;

/**
 * __useRescheduleLessonsMutation__
 *
 * To run a mutation, you first call `useRescheduleLessonsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRescheduleLessonsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rescheduleLessonsMutation, { data, loading, error }] = useRescheduleLessonsMutation({
 *   variables: {
 *      id: // value for 'id'
 *      startAt: // value for 'startAt'
 *      mentorId: // value for 'mentorId'
 *      repeat: // value for 'repeat'
 *   },
 * });
 */
export function useRescheduleLessonsMutation(baseOptions?: Apollo.MutationHookOptions<RescheduleLessonsMutation, RescheduleLessonsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RescheduleLessonsMutation, RescheduleLessonsMutationVariables>(RescheduleLessonsDocument, options);
      }
export type RescheduleLessonsMutationHookResult = ReturnType<typeof useRescheduleLessonsMutation>;
export type RescheduleLessonsMutationResult = Apollo.MutationResult<RescheduleLessonsMutation>;
export type RescheduleLessonsMutationOptions = Apollo.BaseMutationOptions<RescheduleLessonsMutation, RescheduleLessonsMutationVariables>;