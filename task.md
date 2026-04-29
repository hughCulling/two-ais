# Sentence-Level Image Granularity — Task Tracker

- `[ ]` **Phase 1: Core utility**
  - `[ ]` Create `src/lib/segment-utils.ts`
  - `[ ]` Create `src/lib/segment-utils.test.ts`
  - `[ ]` Run tests

- `[ ]` **Phase 2: Types & config**
  - `[ ]` Update `sessionPreset.ts` — add `mediaGranularity` to interface
  - `[ ]` Update `SessionSetupForm.tsx` — add UI control + preset save/load
  - `[ ]` Update conversation details API route types

- `[ ]` **Phase 3: Generation hooks**
  - `[ ]` Update `useInvokeAIImageGen.ts` — use segments
  - `[ ]` Update `useLocalAITTSGen.ts` — use segments

- `[ ]` **Phase 4: ChatInterface**
  - `[ ]` Update interfaces & helpers
  - `[ ]` Update browser TTS playback
  - `[ ]` Update LocalAI TTS playback
  - `[ ]` Update TTS readiness check
  - `[ ]` Update DOM rendering
  - `[ ]` Update gallery sync

- `[ ]` **Phase 5: History page**
  - `[ ]` Update history page rendering & playback

- `[ ]` **Phase 6: Verification**
  - `[ ]` Run tests
  - `[ ]` Run build
