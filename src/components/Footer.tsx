import React from 'react';
// Assuming your SVG is saved as github-mark.svg in src/assets/icons/
// If you have SVGR configured (common in Next.js), this import should work.
// Otherwise, you might need to adjust your Next.js config for SVGs.

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-6 w-full">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          <a
            href="https://github.com/hughCulling/two-ais"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="You can visit my GitHub repository (opens in new tab)"
            title="Visit GitHub repository (opens in new tab)"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-105 transform"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="transition-transform duration-200"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="transition-transform duration-200"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 