import React from "react";

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
  if (isPlayerActive) {
    return (
      <iframe
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