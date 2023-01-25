import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  {
    me {
      id
      firstName
      lastName
      fullName
      role
      email
      gender
      country
      avatar
      timeZone
      phoneNumber
      koreanEquivalent
      
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation login($email: String! $password: String!) {
    authResult: authenticateUserWithPassword(email: $email, password: $password) {
      ...on UserAuthenticationWithPasswordSuccess {
        sessionToken
        item {
          id
        }
      }
      ...on UserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
`;




// 


export const MUTATION_UPDATE_USER = gql `
  mutation updateUser($where: UserWhereUniqueInput! $data: UserUpdateInput!) {
    updateUser(where: $where , data: $data) {
      id 
      firstName
    }
  }
`