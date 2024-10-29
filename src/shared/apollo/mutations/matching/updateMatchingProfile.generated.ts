import * as Types from '../../../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type UpdateMatchingProfileMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  interests?: Types.InputMaybe<Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input']>;
  teachingStyles?: Types.InputMaybe<Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input']>;
  availabilities?: Types.InputMaybe<Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input']>;
  energy: Types.MentorEnergy;
  specializations?: Types.InputMaybe<Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input']>;
  certifications?: Types.InputMaybe<Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input']>;
}>;


export type UpdateMatchingProfileMutation = { __typename?: 'Mutation', updateMatchingProfile: { __typename?: 'MatchingProfile', id: string } };


export const UpdateMatchingProfileDocument = gql`
    mutation updateMatchingProfile($id: ID!, $interests: [ID!], $teachingStyles: [ID!], $availabilities: [ID!], $energy: MentorEnergy!, $specializations: [ID!], $certifications: [ID!]) {
  updateMatchingProfile(
    id: $id
    interests: $interests
    teachingStyles: $teachingStyles
    availabilities: $availabilities
    energy: $energy
    specializations: $specializations
    certifications: $certifications
  ) {
    id
  }
}
    `;
export type UpdateMatchingProfileMutationFn = Apollo.MutationFunction<UpdateMatchingProfileMutation, UpdateMatchingProfileMutationVariables>;

/**
 * __useUpdateMatchingProfileMutation__
 *
 * To run a mutation, you first call `useUpdateMatchingProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMatchingProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMatchingProfileMutation, { data, loading, error }] = useUpdateMatchingProfileMutation({
 *   variables: {
 *      id: // value for 'id'
 *      interests: // value for 'interests'
 *      teachingStyles: // value for 'teachingStyles'
 *      availabilities: // value for 'availabilities'
 *      energy: // value for 'energy'
 *      specializations: // value for 'specializations'
 *      certifications: // value for 'certifications'
 *   },
 * });
 */
export function useUpdateMatchingProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMatchingProfileMutation, UpdateMatchingProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMatchingProfileMutation, UpdateMatchingProfileMutationVariables>(UpdateMatchingProfileDocument, options);
      }
export type UpdateMatchingProfileMutationHookResult = ReturnType<typeof useUpdateMatchingProfileMutation>;
export type UpdateMatchingProfileMutationResult = Apollo.MutationResult<UpdateMatchingProfileMutation>;
export type UpdateMatchingProfileMutationOptions = Apollo.BaseMutationOptions<UpdateMatchingProfileMutation, UpdateMatchingProfileMutationVariables>;