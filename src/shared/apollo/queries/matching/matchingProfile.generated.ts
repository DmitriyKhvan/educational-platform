import * as Types from '../../../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type MatchingProfileQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MatchingProfileQuery = { __typename?: 'Query', matchingProfile: { __typename?: 'MatchingProfile', id: string, energy?: Types.MentorEnergy | null, gender?: Types.GenderType | null, interests?: Array<{ __typename?: 'MatchingProfileInterest', id: string, interest?: string | null, icon?: string | null, translations?: Array<{ __typename?: 'MatchingProfileInterestTranslation', title?: string | null, language?: Types.TranslationsLanguage | null } | null> | null } | null> | null, teachingStyles?: Array<{ __typename?: 'MatchingProfileTeachingStyle', id: string, teachingStyle?: string | null, translations?: Array<{ __typename?: 'MatchingProfileTeachingStyleTranslation', title?: string | null } | null> | null } | null> | null, availabilities?: Array<{ __typename?: 'MatchingProfileAvailability', id: string, day?: string | null, from?: string | null, to?: string | null } | null> | null, certifications?: Array<{ __typename?: 'MentorCertification', id: string, certification?: string | null, shareLink?: string | null, issuedAt?: any | null } | null> | null } };


export const MatchingProfileDocument = gql`
    query matchingProfile {
  matchingProfile {
    id
    interests {
      id
      interest
      icon
      translations {
        title
        language
      }
    }
    teachingStyles {
      id
      teachingStyle
      translations {
        title
      }
    }
    availabilities {
      id
      day
      from
      to
    }
    certifications {
      id
      certification
      shareLink
      issuedAt
    }
    energy
    gender
  }
}
    `;

/**
 * __useMatchingProfileQuery__
 *
 * To run a query within a React component, call `useMatchingProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useMatchingProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMatchingProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useMatchingProfileQuery(baseOptions?: Apollo.QueryHookOptions<MatchingProfileQuery, MatchingProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MatchingProfileQuery, MatchingProfileQueryVariables>(MatchingProfileDocument, options);
      }
export function useMatchingProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MatchingProfileQuery, MatchingProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MatchingProfileQuery, MatchingProfileQueryVariables>(MatchingProfileDocument, options);
        }
export function useMatchingProfileSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MatchingProfileQuery, MatchingProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MatchingProfileQuery, MatchingProfileQueryVariables>(MatchingProfileDocument, options);
        }
export type MatchingProfileQueryHookResult = ReturnType<typeof useMatchingProfileQuery>;
export type MatchingProfileLazyQueryHookResult = ReturnType<typeof useMatchingProfileLazyQuery>;
export type MatchingProfileSuspenseQueryHookResult = ReturnType<typeof useMatchingProfileSuspenseQuery>;
export type MatchingProfileQueryResult = Apollo.QueryResult<MatchingProfileQuery, MatchingProfileQueryVariables>;