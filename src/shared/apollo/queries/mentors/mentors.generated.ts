import * as Types from '../../../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MentorsQueryVariables = Types.Exact<{
  studentId?: Types.InputMaybe<Types.Scalars['ID']['input']>;
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type MentorsQuery = { __typename?: 'Query', mentors?: { __typename?: 'mentorsWithPagination', count?: number | null, mentors: Array<{ __typename?: 'Mentor', id: string, firstName?: string | null, lastName?: string | null, fullName?: string | null, acceptingStudents?: boolean | null, gender?: Types.GenderType | null, major?: string | null, language?: string | null, university?: string | null, graduatingYear?: number | null, degree?: string | null, introduction?: string | null, about?: string | null, experience?: string | null, relevantExperience?: string | null, isActive?: boolean | null, hourlyRate?: number | null, facts?: string | null, uniqueFacts?: string | null, videoUrl?: string | null, avatarId?: string | null, sortOrder?: number | null, avatar?: { __typename?: 'File', id: string, url?: string | null, name?: string | null, mimetype?: string | null, path?: string | null, width?: number | null, height?: number | null, createdAt?: any | null, updatedAt?: any | null } | null, user?: { __typename?: 'User', id: string, email?: string | null, phoneNumber?: string | null, address?: string | null, timeZone?: string | null, country?: string | null, role?: Types.UserRoleType | null, isActive?: boolean | null, createdAt?: any | null, updatedAt?: any | null } | null, lessons?: { __typename?: 'Lesson', id: string, startAt?: any | null, duration?: number | null, status?: Types.LessonStatusType | null, cancelAction?: Types.LessonCancelActionType | null } | null, availabilities: Array<{ __typename?: 'Timesheet', id: string, day?: string | null, from?: string | null, to?: string | null, isTrial?: boolean | null } | null> } | null> } | null };


export const MentorsDocument = gql`
    query mentors($studentId: ID, $page: Int, $limit: Int) {
  mentors(
    visibilityStatus: public
    studentId: $studentId
    page: $page
    limit: $limit
  ) {
    mentors {
      id
      firstName
      lastName
      fullName
      acceptingStudents
      gender
      avatar {
        id
        url
      }
      major
      language
      university
      graduatingYear
      degree
      introduction
      about
      experience
      relevantExperience
      isActive
      hourlyRate
      facts
      uniqueFacts
      videoUrl
      user {
        id
        email
        phoneNumber
        address
        timeZone
        country
        role
        isActive
        createdAt
        updatedAt
      }
      lessons {
        id
        startAt
        duration
        status
        cancelAction
      }
      avatarId
      avatar {
        id
        name
        mimetype
        url
        path
        width
        height
        createdAt
        updatedAt
      }
      availabilities {
        id
        day
        from
        to
        isTrial
      }
      sortOrder
    }
    count
  }
}
    `;

/**
 * __useMentorsQuery__
 *
 * To run a query within a React component, call `useMentorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMentorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMentorsQuery({
 *   variables: {
 *      studentId: // value for 'studentId'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useMentorsQuery(baseOptions?: Apollo.QueryHookOptions<MentorsQuery, MentorsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MentorsQuery, MentorsQueryVariables>(MentorsDocument, options);
      }
export function useMentorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MentorsQuery, MentorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MentorsQuery, MentorsQueryVariables>(MentorsDocument, options);
        }
export function useMentorsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MentorsQuery, MentorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MentorsQuery, MentorsQueryVariables>(MentorsDocument, options);
        }
export type MentorsQueryHookResult = ReturnType<typeof useMentorsQuery>;
export type MentorsLazyQueryHookResult = ReturnType<typeof useMentorsLazyQuery>;
export type MentorsSuspenseQueryHookResult = ReturnType<typeof useMentorsSuspenseQuery>;
export type MentorsQueryResult = Apollo.QueryResult<MentorsQuery, MentorsQueryVariables>;