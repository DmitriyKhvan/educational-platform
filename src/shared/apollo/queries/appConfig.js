import { gql } from '@apollo/client';

export const APP_CONFIG = gql`
  query appConfig {
    appConfigs {
      idd
      configName
      configValue
      description
      createdAt
      updatedAt
    }
  }
`;
