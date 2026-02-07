/// <reference types="vite/client" />

// Extend Vite's ImportMetaEnv with custom env variables
declare interface ImportMetaEnv {
  readonly VITE_VERIFY_RUNTIME_INTEGRITY?: string;
  readonly VITE_CLIENT_REGISTRY?: string;
}
