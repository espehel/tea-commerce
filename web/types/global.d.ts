declare namespace NodeJS {
  interface ProcessEnv {
    STRIPE_PUBLIC_KEY: string;
    STRIPE_PRIVATE_KEY: string;
    SANITY_PROJECT_ID: string;
  }
}
interface Window {
  ENV: {
    STRIPE_PUBLIC_KEY: string;
  };
}
