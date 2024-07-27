/// <reference types="vite/client" />

interface ImportMeta {
  env: {
    [key: string]: string | boolean | undefined;
    MODE: 'development' | 'production';
    BASE_URL: string;
    PROD: boolean;
    DEV: boolean;
  };
}
