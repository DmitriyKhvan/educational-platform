import * as Types from '../../../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type AvailabilitySlotsQueryVariables = Types.Exact<{
  mentorId: Types.Scalars['ID']['input'];
  timezone: Types.Scalars['String']['input'];
  rangeStart: Types.Scalars['String']['input'];
  rangeEnd: Types.Scalars['String']['input'];
  duration: Types.Scalars['Int']['input'];
}>;


export type AvailabilitySlotsQuery = { __typename?: 'Query', availabilitySlots: Array<{ __typename?: 'GroupedAvailabilitySlots', date: string, timeSlots: Array<{ __typename?: 'AvailabilitySlot', date: string, from: string, to: string }> } | null> };


export const AvailabilitySlotsDocument = gql`
    query availabilitySlots($mentorId: ID!, $timezone: String!, $rangeStart: String!, $rangeEnd: String!, $duration: Int!) {
  availabilitySlots(
    mentorId: $mentorId
    timezone: $timezone
    rangeStart: $rangeStart
    rangeEnd: $rangeEnd
    duration: $duration
  ) {
    date
    timeSlots {
      date
      from
      to
    }
  }
}
    `;

/**
 * __useAvailabilitySlotsQuery__
 *
 * To run a query within a React component, call `useAvailabilitySlotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvailabilitySlotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvailabilitySlotsQuery({
 *   variables: {
 *      mentorId: // value for 'mentorId'
 *      timezone: // value for 'timezone'
 *      rangeStart: // value for 'rangeStart'
 *      rangeEnd: // value for 'rangeEnd'
 *      duration: // value for 'duration'
 *   },
 * });
 */
export function useAvailabilitySlotsQuery(baseOptions: Apollo.QueryHookOptions<AvailabilitySlotsQuery, AvailabilitySlotsQueryVariables> & ({ variables: AvailabilitySlotsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AvailabilitySlotsQuery, AvailabilitySlotsQueryVariables>(AvailabilitySlotsDocument, options);
      }
export function useAvailabilitySlotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AvailabilitySlotsQuery, AvailabilitySlotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AvailabilitySlotsQuery, AvailabilitySlotsQueryVariables>(AvailabilitySlotsDocument, options);
        }
export function useAvailabilitySlotsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AvailabilitySlotsQuery, AvailabilitySlotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AvailabilitySlotsQuery, AvailabilitySlotsQueryVariables>(AvailabilitySlotsDocument, options);
        }
export type AvailabilitySlotsQueryHookResult = ReturnType<typeof useAvailabilitySlotsQuery>;
export type AvailabilitySlotsLazyQueryHookResult = ReturnType<typeof useAvailabilitySlotsLazyQuery>;
export type AvailabilitySlotsSuspenseQueryHookResult = ReturnType<typeof useAvailabilitySlotsSuspenseQuery>;
export type AvailabilitySlotsQueryResult = Apollo.QueryResult<AvailabilitySlotsQuery, AvailabilitySlotsQueryVariables>;