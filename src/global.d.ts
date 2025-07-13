export {};

declare global {
  interface Window {
    __CSP_NONCE__?: string;
  }
} 