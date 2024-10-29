import * as Types from '../../../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateMatchingProfileForMentorMutationVariables = Types.Exact<{
  mentorId: Types.Scalars['ID']['input'];
  interests: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
  teachingStyles: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
  specializations: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
  energy: Types.MentorEnergy;
  certifications: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type CreateMatchingProfileForMentorMutation = { __typename?: 'Mutation', createMatchingProfileForMentor: { __typename?: 'MatchingProfile', id: string } };


export const CreateMatchingProfileForMentorDocument = gql`
    mutation createMatchingProfileForMentor($mentorId: ID!, $interests: [ID!]!, $teachingStyles: [ID!]!, $specializations: [ID!]!, $energy: MentorEnergy!, $certifications: [ID!]!) {
  createMatchingProfileForMentor(
    mentorId: $mentorId
    interests: $interests
    teachingStyles: $teachingStyles
    specializations: $specializations
    energy: $energy
    certifications: $certifications
  ) {
    id
  }
}
    `;
export type CreateMatchingProfileForMentorMutationFn = Apollo.MutationFunction<CreateMatchingProfileForMentorMutation, CreateMatchingProfileForMentorMutationVariables>;

/**
 * __useCreateMatchingProfileForMentorMutation__
 *
 * To run a mutation, you first call `useCreateMatchingProfileForMentorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMatchingProfileForMentorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMatchingProfileForMentorMutation, { data, loading, error }] = useCreateMatchingProfileForMentorMutation({
 *   variables: {
 *      mentorId: // value for 'mentorId'
 *      interests: // value for 'interests'
 *      teachingStyles: // value for 'teachingStyles'
 *      specializations: // value for 'specializations'
 *      energy: // value for 'energy'
 *      certifications: // value for 'certifications'
 *   },
 * });
 */
export function useCreateMatchingProfileForMentorMutation(baseOptions?: Apollo.MutationHookOptions<CreateMatchingProfileForMentorMutation, CreateMatchingProfileForMentorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMatchingProfileForMentorMutation, CreateMatchingProfileForMentorMutationVariables>(CreateMatchingProfileForMentorDocument, options);
      }
export type CreateMatchingProfileForMentorMutationHookResult = ReturnType<typeof useCreateMatchingProfileForMentorMutation>;
export type CreateMatchingProfileForMentorMutationResult = Apollo.MutationResult<CreateMatchingProfileForMentorMutation>;
export type CreateMatchingProfileForMentorMutationOptions = Apollo.BaseMutationOptions<CreateMatchingProfileForMentorMutation, CreateMatchingProfileForMentorMutationVariables>;