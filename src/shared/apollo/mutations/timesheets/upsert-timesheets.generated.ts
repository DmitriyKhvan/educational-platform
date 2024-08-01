import * as Types from '../../../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpsertTimesheetsMutationVariables = Types.Exact<{
  mentorId: Types.Scalars['ID']['input'];
  timesheets: Array<Types.TimesheetSlot> | Types.TimesheetSlot;
  timezone?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type UpsertTimesheetsMutation = { __typename?: 'Mutation', upsertTimesheets: Array<{ __typename?: 'Timesheet', id: string, day?: string | null, from?: string | null, to?: string | null, isTrial?: boolean | null } | null> };


export const UpsertTimesheetsDocument = gql`
    mutation upsertTimesheets($mentorId: ID!, $timesheets: [TimesheetSlot!]!, $timezone: String) {
  upsertTimesheets(
    mentorId: $mentorId
    timesheets: $timesheets
    timezone: $timezone
  ) {
    id
    day
    from
    to
    isTrial
  }
}
    `;
export type UpsertTimesheetsMutationFn = Apollo.MutationFunction<UpsertTimesheetsMutation, UpsertTimesheetsMutationVariables>;

/**
 * __useUpsertTimesheetsMutation__
 *
 * To run a mutation, you first call `useUpsertTimesheetsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertTimesheetsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertTimesheetsMutation, { data, loading, error }] = useUpsertTimesheetsMutation({
 *   variables: {
 *      mentorId: // value for 'mentorId'
 *      timesheets: // value for 'timesheets'
 *      timezone: // value for 'timezone'
 *   },
 * });
 */
export function useUpsertTimesheetsMutation(baseOptions?: Apollo.MutationHookOptions<UpsertTimesheetsMutation, UpsertTimesheetsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertTimesheetsMutation, UpsertTimesheetsMutationVariables>(UpsertTimesheetsDocument, options);
      }
export type UpsertTimesheetsMutationHookResult = ReturnType<typeof useUpsertTimesheetsMutation>;
export type UpsertTimesheetsMutationResult = Apollo.MutationResult<UpsertTimesheetsMutation>;
export type UpsertTimesheetsMutationOptions = Apollo.BaseMutationOptions<UpsertTimesheetsMutation, UpsertTimesheetsMutationVariables>;