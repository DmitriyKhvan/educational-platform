import * as Types from '../../../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MentorQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type MentorQuery = { __typename?: 'Query', mentor?: { __typename?: 'Mentor', id: string, firstName?: string | null, lastName?: string | null, gender?: Types.GenderType | null, major?: string | null, university?: string | null, graduatingYear?: number | null, degree?: string | null, introduction?: string | null, about?: string | null, relevantExperience?: string | null, isActive?: boolean | null, hourlyRate?: number | null, uniqueFacts?: string | null, fullName?: string | null, userId?: string | null, videoUrl?: string | null, avatarId?: string | null, visibilityStatus?: Types.VisibilityStatus | null, playgroundId?: string | null, mentorAvailability?: Types.MentorAvailabilityType | null, user?: { __typename?: 'User', id: string, email?: string | null, phoneNumber?: string | null, address?: string | null, timeZone?: string | null, country?: string | null, isActive?: boolean | null, role?: Types.UserRoleType | null, cardLast4?: string | null, createdAt?: any | null, updatedAt?: any | null } | null, lessons?: { __typename?: 'Lesson', id: string, startAt?: any | null, duration?: number | null, status?: Types.LessonStatusType | null, cancelAction?: Types.LessonCancelActionType | null, cancelReason?: string | null, canceledBy?: Types.UserRoleType | null } | null, avatar?: { __typename?: 'File', id: string, url?: string | null } | null, availabilities: Array<{ __typename?: 'Timesheet', id: string, day?: string | null, from?: string | null, to?: string | null, isTrial?: boolean | null } | null>, exceptionDates: Array<{ __typename?: 'ExceptionDate', id: string, date?: string | null, from?: string | null, to?: string | null } | null> } | null };


export const MentorDocument = gql`
    query mentor($id: ID!) {
  mentor(id: $id) {
    id
    firstName
    lastName
    gender
    major
    university
    graduatingYear
    degree
    introduction
    about
    relevantExperience
    isActive
    hourlyRate
    uniqueFacts
    fullName
    userId
    user {
      id
      email
      phoneNumber
      address
      timeZone
      country
      isActive
      role
      cardLast4
      createdAt
      updatedAt
    }
    lessons {
      id
      startAt
      duration
      status
      cancelAction
      cancelReason
      canceledBy
    }
    videoUrl
    avatarId
    visibilityStatus
    avatar {
      id
      url
    }
    availabilities {
      id
      day
      from
      to
      isTrial
    }
    exceptionDates {
      id
      date
      from
      to
    }
    playgroundId
    mentorAvailability
  }
}
    `;

/**
 * __useMentorQuery__
 *
 * To run a query within a React component, call `useMentorQuery` and pass it any options that fit your needs.
 * When your component renders, `useMentorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMentorQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMentorQuery(baseOptions: Apollo.QueryHookOptions<MentorQuery, MentorQueryVariables> & ({ variables: MentorQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MentorQuery, MentorQueryVariables>(MentorDocument, options);
      }
export function useMentorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MentorQuery, MentorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MentorQuery, MentorQueryVariables>(MentorDocument, options);
        }
export function useMentorSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MentorQuery, MentorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MentorQuery, MentorQueryVariables>(MentorDocument, options);
        }
export type MentorQueryHookResult = ReturnType<typeof useMentorQuery>;
export type MentorLazyQueryHookResult = ReturnType<typeof useMentorLazyQuery>;
export type MentorSuspenseQueryHookResult = ReturnType<typeof useMentorSuspenseQuery>;
export type MentorQueryResult = Apollo.QueryResult<MentorQuery, MentorQueryVariables>;