// src/components/setup/SetupInstructions.tsx
'use client';

import React, { useState } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface SetupInstructionsProps {
  type: 'ollama' | 'localai' | 'invokeai';
}

export function SetupInstructions({ type }: SetupInstructionsProps) {
  const { t } = useTranslation();
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const copyToClipboard = (text: string, stepId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStep(stepId);
      setTimeout(() => setCopiedStep(null), 2000);
    });
  };

  const CopyButton = ({ text, stepId }: { text: string; stepId: string }) => (
    <button
      onClick={() => copyToClipboard(text, stepId)}
      className="ml-2 p-1 hover:bg-white/20 dark:hover:bg-black/20 rounded transition-all duration-200 inline-flex items-center gap-1 group active:scale-90"
      title="Copy to clipboard"
    >
      {copiedStep === stepId ? (
        <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
      ) : (
        <Copy className="h-3 w-3 text-blue-600 dark:text-blue-400 opacity-70 group-hover:opacity-100" />
      )}
    </button>
  );

  if (!t) return null;

  if (type === 'ollama') {
    return (
      <div className="space-y-2 mt-4">
        <div className="liquid-glass border border-white/20 dark:border-white/10 rounded-md p-3 mb-4 text-sm space-y-2">
          <p>
            <span className="font-bold">Prerequisites:</span>
          </p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>
              {t.page_OllamaStep1.split('ollama.com/download')[0]}
              <span className="whitespace-nowrap">
                <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium underline inline-flex items-center gap-1">
                  ollama.com/download
                  <ExternalLink className="h-3 w-3" aria-label="(opens in new tab)" />
                </a>
                {t.page_OllamaStep1.split('ollama.com/download')[1]}
              </span>
            </li>
            <li>
              Your ngrok config file location. This can be found by running:
              <div className="flex items-center justify-center gap-1 mt-1">
                <code className="bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded font-mono text-xs">ngrok config check</code>
                <CopyButton text="ngrok config check" stepId={`${type}-ngrok-config`} />
              </div>
            </li>
          </ol>
        </div>

        <p className="text-center">
          <span>1. You can run this command in your terminal to start the Ollama server:</span>
        </p>
        <div className="flex items-center justify-center">
          <span className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 p-1 rounded inline-block">
            {t.page_OllamaStep3.replace(/^1\.\s*/, '')}
          </span>
          <CopyButton text={t.page_OllamaStep3.replace(/^1\.\s*/, '')} stepId={`${type}-step1`} />
        </div>
        <p className="text-center mt-3">
          <span>2. You can edit your ngrok config file and add this tunnel configuration:</span>
        </p>
        <div className="flex justify-center items-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded inline-block">
            <pre className="font-mono text-xs text-left whitespace-pre m-0">
              {`tunnels:
  ollama:
    proto: http
    addr: 11434
    host_header: "localhost:11434"`}
            </pre>
          </div>
          <CopyButton text={`tunnels:
  ollama:
    proto: http
    addr: 11434
    host_header: "localhost:11434"`} stepId={`${type}-yaml`} />
        </div>
        <div className="mt-3 text-xs text-muted-foreground space-y-1">
          <div className="text-center">
            <span className="inline-block relative pl-4">
              <span className="absolute left-0 top-0">•</span>
              <span>Creating a second <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">tunnels:</code> key would cause the first to be overwritten.</span>
            </span>
          </div>
          <div className="text-center">
            <span className="inline-block relative pl-4">
              <span className="absolute left-0 top-0">•</span>
              <span>You can append the <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">ollama:</code> section inside a pre-existing <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">tunnels:</code> mapping.</span>
            </span>
          </div>
        </div>
        <p className="text-center mt-3">
          <span>3. You can start ngrok with this command:</span>
        </p>
        <div className="flex items-center justify-center">
          <span className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 p-1 rounded inline-block">
            ngrok start --all
          </span>
          <CopyButton text="ngrok start --all" stepId={`${type}-step3`} />
        </div>
        <p className="text-center mt-3">
          <span>4. Then you can paste your URL forwarding to <span className="text-blue-600 dark:text-blue-400 font-medium">http://localhost:11434</span> here and verify it:</span>
        </p>
      </div>
    );
  }

  if (type === 'localai') {
    return (
      <div className="space-y-2 mt-4">
        <div className="liquid-glass border border-white/20 dark:border-white/10 rounded-md p-3 mb-4 text-sm space-y-2">
          <p>
            <span className="font-bold">Prerequisites:</span>
          </p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>
              LocalAI installed on your machine. It is installable from {' '}
              <span className="whitespace-nowrap">
                <a href="https://localai.io/installation/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium underline inline-flex items-center gap-1">
                  localai.io/installation
                  <ExternalLink className="h-3 w-3" aria-label="(opens in new tab)" />
                </a>
              </span>
              {' '}.
            </li>
            <li>
              Your ngrok config file location. This can be found by running:
              <div className="flex items-center justify-center gap-1 mt-1">
                <code className="bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded font-mono text-xs">ngrok config check</code>
                <CopyButton text="ngrok config check" stepId={`${type}-ngrok-config`} />
              </div>
            </li>
          </ol>
        </div>

        <p className="text-center">
          <span>1. You can run one of these commands in a terminal to start the LocalAI server:</span>
        </p>
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center">
            <span className="text-xs text-muted-foreground mr-2">Docker:</span>
            <span className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 p-1 rounded inline-block">
              docker run -p 8080:8080 --name local-ai -ti localai/localai:latest
            </span>
            <CopyButton text="docker run -p 8080:8080 --name local-ai -ti localai/localai:latest" stepId={`${type}-docker`} />
          </div>
          <div className="flex items-center justify-center">
            <span className="text-xs text-muted-foreground mr-2">Podman:</span>
            <span className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 p-1 rounded inline-block">
              podman run -p 8080:8080 --name local-ai -ti localai/localai:latest
            </span>
            <CopyButton text="podman run -p 8080:8080 --name local-ai -ti localai/localai:latest" stepId={`${type}-podman`} />
          </div>
          <div className="flex items-center justify-center">
            <span className="text-xs text-muted-foreground mr-2">macOS/Linux:</span>
            <span className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 p-1 rounded inline-block">
              local-ai
            </span>
            <CopyButton text="local-ai" stepId={`${type}-binary`} />
          </div>
          <p className="text-xs text-muted-foreground text-center max-w-md">
            Or you can start the container from the Docker Desktop app.
          </p>
        </div>
        <p className="text-center mt-3">
          <span>2. You can edit your ngrok config file and add this tunnel configuration:</span>
        </p>
        <div className="flex justify-center items-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded inline-block">
            <pre className="font-mono text-xs text-left whitespace-pre m-0">
              {`tunnels:
  localai:
    proto: http
    addr: 8080
    host_header: "localhost:8080"`}
            </pre>
          </div>
          <CopyButton text={`tunnels:
  localai:
    proto: http
    addr: 8080
    host_header: "localhost:8080"`} stepId={`${type}-yaml`} />
        </div>
        <div className="mt-3 text-xs text-muted-foreground space-y-1">
          <div className="text-center">
            <span className="inline-block relative pl-4">
              <span className="absolute left-0 top-0">•</span>
              <span>Creating a second <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">tunnels:</code> key would cause the first to be overwritten.</span>
            </span>
          </div>
          <div className="text-center">
            <span className="inline-block relative pl-4">
              <span className="absolute left-0 top-0">•</span>
              <span>You can append the <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">localai:</code> section inside a pre-existing <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">tunnels:</code> mapping.</span>
            </span>
          </div>
        </div>
        <p className="text-center mt-3">
          <span>3. You can start ngrok with this command:</span>
        </p>
        <div className="flex items-center justify-center">
          <span className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 p-1 rounded inline-block">
            ngrok start --all
          </span>
          <CopyButton text="ngrok start --all" stepId={`${type}-step3`} />
        </div>
        <p className="text-center mt-3">
          <span>4. Then you can paste your URL forwarding to <span className="text-blue-600 dark:text-blue-400 font-medium">http://localhost:8080</span> here and verify it:</span>
        </p>
      </div>
    );
  }

  if (type === 'invokeai') {
    return (
      <div className="space-y-2 mt-4">
        <div className="liquid-glass border border-white/20 dark:border-white/10 rounded-md p-3 mb-4 text-sm space-y-2">
          <p>
            <span className="font-bold">Prerequisites:</span>
          </p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>
              Invoke installed on your machine. It is downloadable from{' '}
              <span className="whitespace-nowrap">
                <a href="https://invoke.ai/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-medium underline inline-flex items-center gap-1">
                  invoke.ai
                  <ExternalLink className="h-3 w-3" aria-label="(opens in new tab)" />
                </a>.
              </span>
            </li>
            <li>
              Your ngrok config file location. This can be found by running:
              <div className="flex items-center justify-center gap-1 mt-1">
                <code className="bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded font-mono text-xs">ngrok config check</code>
                <CopyButton text="ngrok config check" stepId={`${type}-ngrok-config`} />
              </div>
            </li>
          </ol>
        </div>

        <p>
          1. You can open the Invoke installation and click the <span className="font-medium bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">Launch</span> button to start the Invoke server.
        </p>
        <p className="text-center mt-3">
          <span>2. You can edit your ngrok config file and add this tunnel configuration:</span>
        </p>
        <div className="flex justify-center items-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded inline-block">
            <pre className="font-mono text-xs text-left whitespace-pre m-0">
              {`tunnels:
  invokeai:
    proto: http
    addr: 9090
    host_header: "localhost:9090"`}
            </pre>
          </div>
          <CopyButton text={`tunnels:
  invokeai:
    proto: http
    addr: 9090
    host_header: "localhost:9090"`} stepId={`${type}-yaml`} />
        </div>
        <div className="mt-3 text-xs text-muted-foreground space-y-1">
          <div className="text-center">
            <span className="inline-block relative pl-4">
              <span className="absolute left-0 top-0">•</span>
              <span>Creating a second <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">tunnels:</code> key would cause the first to be overwritten.</span>
            </span>
          </div>
          <div className="text-center">
            <span className="inline-block relative pl-4">
              <span className="absolute left-0 top-0">•</span>
              <span>You can append the <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">invokeai:</code> section inside a pre-existing <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">tunnels:</code> mapping.</span>
            </span>
          </div>
        </div>
        <p className="text-center mt-3">
          <span>3. You can start ngrok with this command:</span>
        </p>
        <div className="flex items-center justify-center">
          <span className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 p-1 rounded inline-block">
            ngrok start --all
          </span>
          <CopyButton text="ngrok start --all" stepId={`${type}-step3`} />
        </div>
        <p className="text-center mt-3">
          <span>4. Then you can paste your URL forwarding to <span className="text-blue-600 dark:text-blue-400 font-medium">http://localhost:9090</span> here and verify it:</span>
        </p>
      </div>
    );
  }

  return null;
}
