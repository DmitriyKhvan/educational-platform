import * as Types from '../../../../types/types.generated';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type CreateMatchingProfileForStudentMutationVariables = Types.Exact<{
  studentId: Types.Scalars['ID']['input'];
  interests: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
  teachingStyles: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
  availabilities: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
  energy: Types.MentorEnergy;
  gender: Types.GenderType;
}>;


export type CreateMatchingProfileForStudentMutation = { __typename?: 'Mutation', createMatchingProfileForStudent: { __typename?: 'MatchingProfile', id: string } };


export const CreateMatchingProfileForStudentDocument = gql`
    mutation createMatchingProfileForStudent($studentId: ID!, $interests: [ID!]!, $teachingStyles: [ID!]!, $availabilities: [ID!]!, $energy: MentorEnergy!, $gender: GenderType!) {
  createMatchingProfileForStudent(
    studentId: $studentId
    interests: $interests
    teachingStyles: $teachingStyles
    availabilities: $availabilities
    energy: $energy
    gender: $gender
  ) {
    id
  }
}
    `;
export type CreateMatchingProfileForStudentMutationFn = Apollo.MutationFunction<CreateMatchingProfileForStudentMutation, CreateMatchingProfileForStudentMutationVariables>;

/**
 * __useCreateMatchingProfileForStudentMutation__
 *
 * To run a mutation, you first call `useCreateMatchingProfileForStudentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMatchingProfileForStudentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMatchingProfileForStudentMutation, { data, loading, error }] = useCreateMatchingProfileForStudentMutation({
 *   variables: {
 *      studentId: // value for 'studentId'
 *      interests: // value for 'interests'
 *      teachingStyles: // value for 'teachingStyles'
 *      availabilities: // value for 'availabilities'
 *      energy: // value for 'energy'
 *      gender: // value for 'gender'
 *   },
 * });
 */
export function useCreateMatchingProfileForStudentMutation(baseOptions?: Apollo.MutationHookOptions<CreateMatchingProfileForStudentMutation, CreateMatchingProfileForStudentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMatchingProfileForStudentMutation, CreateMatchingProfileForStudentMutationVariables>(CreateMatchingProfileForStudentDocument, options);
      }
export type CreateMatchingProfileForStudentMutationHookResult = ReturnType<typeof useCreateMatchingProfileForStudentMutation>;
export type CreateMatchingProfileForStudentMutationResult = Apollo.MutationResult<CreateMatchingProfileForStudentMutation>;
export type CreateMatchingProfileForStudentMutationOptions = Apollo.BaseMutationOptions<CreateMatchingProfileForStudentMutation, CreateMatchingProfileForStudentMutationVariables>;