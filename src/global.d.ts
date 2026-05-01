export {};

declare global {
  interface Navigator {
    xr?: {
      isSessionSupported?: (mode: 'immersive-vr') => Promise<boolean>;
      requestSession?: (mode: 'immersive-vr', options?: unknown) => Promise<unknown>;
    };
  }

  interface Window {
    __CSP_NONCE__?: string;
  }
}
