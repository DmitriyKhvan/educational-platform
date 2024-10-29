import * as Types from '../../../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type LanguageLevelsWithPaginationQueryVariables = Types.Exact<{
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
  page?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type LanguageLevelsWithPaginationQuery = { __typename?: 'Query', languageLevelsWithPagination: { __typename?: 'LanguageLevelWithPagination', count: number, languageLevels: Array<{ __typename?: 'LanguageLevel', id?: string | null, title?: string | null, isActive?: boolean | null, sortOrder?: number | null, description?: string | null, createdAt?: any | null, updatedAt?: any | null, translations?: Array<{ __typename?: 'LanguageLevelTranslation', id: string, title?: string | null, language?: Types.CourseTranslationsLanguage | null } | null> | null } | null> } };


export const LanguageLevelsWithPaginationDocument = gql`
    query languageLevelsWithPagination($search: String, $page: Int, $limit: Int) {
  languageLevelsWithPagination(search: $search, page: $page, limit: $limit) {
    languageLevels {
      id
      title
      isActive
      sortOrder
      description
      translations {
        id
        title
        language
      }
      createdAt
      updatedAt
    }
    count
  }
}
    `;

/**
 * __useLanguageLevelsWithPaginationQuery__
 *
 * To run a query within a React component, call `useLanguageLevelsWithPaginationQuery` and pass it any options that fit your needs.
 * When your component renders, `useLanguageLevelsWithPaginationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLanguageLevelsWithPaginationQuery({
 *   variables: {
 *      search: // value for 'search'
 *      page: // value for 'page'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useLanguageLevelsWithPaginationQuery(baseOptions?: Apollo.QueryHookOptions<LanguageLevelsWithPaginationQuery, LanguageLevelsWithPaginationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LanguageLevelsWithPaginationQuery, LanguageLevelsWithPaginationQueryVariables>(LanguageLevelsWithPaginationDocument, options);
      }
export function useLanguageLevelsWithPaginationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LanguageLevelsWithPaginationQuery, LanguageLevelsWithPaginationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LanguageLevelsWithPaginationQuery, LanguageLevelsWithPaginationQueryVariables>(LanguageLevelsWithPaginationDocument, options);
        }
export function useLanguageLevelsWithPaginationSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<LanguageLevelsWithPaginationQuery, LanguageLevelsWithPaginationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LanguageLevelsWithPaginationQuery, LanguageLevelsWithPaginationQueryVariables>(LanguageLevelsWithPaginationDocument, options);
        }
export type LanguageLevelsWithPaginationQueryHookResult = ReturnType<typeof useLanguageLevelsWithPaginationQuery>;
export type LanguageLevelsWithPaginationLazyQueryHookResult = ReturnType<typeof useLanguageLevelsWithPaginationLazyQuery>;
export type LanguageLevelsWithPaginationSuspenseQueryHookResult = ReturnType<typeof useLanguageLevelsWithPaginationSuspenseQuery>;
export type LanguageLevelsWithPaginationQueryResult = Apollo.QueryResult<LanguageLevelsWithPaginationQuery, LanguageLevelsWithPaginationQueryVariables>;