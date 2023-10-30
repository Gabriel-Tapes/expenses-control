export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string
      DB_PORT: number
      DB_DATABASE: string
      DB_USER: string
      DB_PASSWORD: string
      JWT_SECRET: string
    }
  }
}
