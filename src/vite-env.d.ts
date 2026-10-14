/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORM_ENDPOINT_CONTACT?: string;
  readonly VITE_FORM_ENDPOINT_APPLICATION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
