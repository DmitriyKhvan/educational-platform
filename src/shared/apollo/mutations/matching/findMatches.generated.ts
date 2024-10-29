import * as Types from '../../../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type FindMatchesQueryVariables = Types.Exact<{
  matchingProfileId: Types.Scalars['ID']['input'];
}>;


export type FindMatchesQuery = { __typename?: 'Query', findMatches?: Array<{ __typename?: 'Mentor', id: string, firstName?: string | null, lastName?: string | null, gender?: Types.GenderType | null, major?: string | null, university?: string | null, degree?: string | null, introduction?: string | null, about?: string | null, relevantExperience?: string | null, isActive?: boolean | null, hourlyRate?: number | null, uniqueFacts?: string | null, fullName?: string | null, userId?: string | null, videoUrl?: string | null, avatarId?: string | null, visibilityStatus?: Types.VisibilityStatus | null, playgroundId?: string | null, acceptingStudents?: boolean | null, sortOrder?: number | null, avatar?: { __typename?: 'File', id: string, name?: string | null, mimetype?: string | null, url?: string | null, path?: string | null, width?: number | null, height?: number | null, createdAt?: any | null, updatedAt?: any | null } | null, availabilities: Array<{ __typename?: 'Timesheet', id: string, day?: string | null, from?: string | null, to?: string | null, isTrial?: boolean | null } | null>, matchingProfile?: { __typename?: 'MatchingProfile', id: string, energy?: Types.MentorEnergy | null, interests?: Array<{ __typename?: 'MatchingProfileInterest', icon?: string | null, interest?: string | null, translations?: Array<{ __typename?: 'MatchingProfileInterestTranslation', title?: string | null, language?: Types.TranslationsLanguage | null } | null> | null } | null> | null, teachingStyles?: Array<{ __typename?: 'MatchingProfileTeachingStyle', teachingStyle?: string | null, translations?: Array<{ __typename?: 'MatchingProfileTeachingStyleTranslation', title?: string | null, language?: Types.TranslationsLanguage | null } | null> | null } | null> | null, certifications?: Array<{ __typename?: 'MentorCertification', certification?: string | null } | null> | null } | null } | null> | null };


export const FindMatchesDocument = gql`
    query findMatches($matchingProfileId: ID!) {
  findMatches(matchingProfileId: $matchingProfileId) {
    id
    firstName
    lastName
    gender
    major
    university
    degree
    introduction
    about
    relevantExperience
    isActive
    hourlyRate
    uniqueFacts
    fullName
    userId
    videoUrl
    avatarId
    visibilityStatus
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
    playgroundId
    acceptingStudents
    sortOrder
    matchingProfile {
      id
      interests {
        icon
        interest
        translations {
          title
          language
        }
      }
      teachingStyles {
        teachingStyle
        translations {
          title
          language
        }
      }
      certifications {
        certification
      }
      energy
    }
  }
}
    `;

/**
 * __useFindMatchesQuery__
 *
 * To run a query within a React component, call `useFindMatchesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindMatchesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindMatchesQuery({
 *   variables: {
 *      matchingProfileId: // value for 'matchingProfileId'
 *   },
 * });
 */
export function useFindMatchesQuery(baseOptions: Apollo.QueryHookOptions<FindMatchesQuery, FindMatchesQueryVariables> & ({ variables: FindMatchesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindMatchesQuery, FindMatchesQueryVariables>(FindMatchesDocument, options);
      }
export function useFindMatchesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindMatchesQuery, FindMatchesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindMatchesQuery, FindMatchesQueryVariables>(FindMatchesDocument, options);
        }
export function useFindMatchesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<FindMatchesQuery, FindMatchesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindMatchesQuery, FindMatchesQueryVariables>(FindMatchesDocument, options);
        }
export type FindMatchesQueryHookResult = ReturnType<typeof useFindMatchesQuery>;
export type FindMatchesLazyQueryHookResult = ReturnType<typeof useFindMatchesLazyQuery>;
export type FindMatchesSuspenseQueryHookResult = ReturnType<typeof useFindMatchesSuspenseQuery>;
export type FindMatchesQueryResult = Apollo.QueryResult<FindMatchesQuery, FindMatchesQueryVariables>;