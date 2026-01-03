/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTAINER_APP_URL: string
  readonly VITE_BOOK_LIST_APP_URL: string
  readonly VITE_SINGLE_BOOK_APP_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
