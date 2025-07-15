import React, { useRef, useEffect } from "react";

const YOUTUBE_VIDEO_ID_LIGHT = "52oUvRFdaXE";
const YOUTUBE_VIDEO_ID_DARK = "pkN_uU-nDdk";

const YouTubeFacade: React.FC<{
  mode: "light" | "dark";
  title: string;
  isPlayerActive: boolean;
  onActivatePlayer: () => void;
}> = ({ mode, title, isPlayerActive, onActivatePlayer }) => {
  const videoId = mode === "dark" ? YOUTUBE_VIDEO_ID_DARK : YOUTUBE_VIDEO_ID_LIGHT;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Suppress CORS errors in console
  useEffect(() => {
    if (isPlayerActive && iframeRef.current) {
      const originalError = console.error;
      const originalWarn = console.warn;
      const originalOnError = window.onerror;
      
      // Temporarily suppress CORS-related errors
      const suppressCorsErrors = (args: unknown[]) => {
        const message = args[0]?.toString() || '';
        if (message.includes('CORS') || 
            message.includes('access control checks') ||
            message.includes('youtube.com/api/stats') ||
            message.includes('youtube.com/youtubei/v1/log_event') ||
            message.includes('Fetch API cannot load') ||
            message.includes('XMLHttpRequest cannot load') ||
            message.includes('youtube.com/api/stats/qoe') ||
            message.includes('youtube.com/api/stats/watchtime') ||
            message.includes('youtube.com/api/stats/atr')) {
          return; // Suppress these errors
        }
        originalError.apply(console, args);
      };
      
      // Global error handler for YouTube-related errors
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const globalErrorHandler = (message: string | Event, _source?: string, _lineno?: number, _colno?: number, _error?: Error) => {
        const errorMessage = typeof message === 'string' ? message : message.toString();
        if (errorMessage.includes('youtube.com') || 
            errorMessage.includes('CORS') || 
            errorMessage.includes('access control checks')) {
          return true; // Prevent default error handling
        }
        return false; // Allow other errors to be handled normally
      };
      
      console.error = suppressCorsErrors;
      window.onerror = globalErrorHandler;
      
      return () => {
        console.error = originalError;
        console.warn = originalWarn;
        window.onerror = originalOnError;
      };
    }
  }, [isPlayerActive]);
  
  if (isPlayerActive) {
    return (
      <iframe
        ref={iframeRef}
        key={videoId} // Force recreation only when video ID changes
        className="w-full h-full"
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    );
  }
  
  return (
    <button
      type="button"
      className="absolute inset-0 w-full h-full flex items-center justify-center focus:outline-none bg-transparent group"
      aria-label={`Play video: ${title}`}
      onClick={onActivatePlayer}
      style={{ zIndex: 2 }}
    >
      <svg
        className="h-16 w-16 text-white drop-shadow-lg group-hover:scale-110 transition-transform"
        viewBox="0 0 68 48"
        width="68"
        height="48"
        aria-hidden="true"
      >
        <path d="M66.52 7.85a8 8 0 0 0-5.6-5.66C57.12 1.33 34 1.33 34 1.33s-23.12 0-26.92 0a8 8 0 0 0-5.6 5.66A83.2 83.2 0 0 0 0 24a83.2 83.2 0 0 0 1.48 16.15 8 8 0 0 0 5.6 5.66c3.8 1.33 26.92 1.33 26.92 1.33s23.12 0 26.92-1.33a8 8 0 0 0 5.6-5.66A83.2 83.2 0 0 0 68 24a83.2 83.2 0 0 0-1.48-16.15z" fill="#f00" />
        <path d="M45 24 27 14v20z" fill="#fff" />
      </svg>
    </button>
  );
};

export default YouTubeFacade; 