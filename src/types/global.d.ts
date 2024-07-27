interface IntercomMetadata {
  api_base?: string;
  app_id: string;
  name?: string;
  email?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    Intercom: (command: string, metadata?: IntercomMetadata) => void;
  }
}

export type {};
