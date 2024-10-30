interface ImportMetaEnv {
  VITE_DEGREE_SERVICE_HOST: string;
  VITE_DEGREE_SERVICE_PORT: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
