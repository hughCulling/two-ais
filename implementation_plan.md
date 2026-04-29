# Sentence-Level Image Granularity (Media Segment Refactor)

Add an **Image cadence** option to the session setup form, allowing users to choose between generating images per paragraph (current default) or per sentence. This requires introducing a shared "media segment" abstraction so image generation, TTS, auto-scroll, gallery sync, and rendering all operate on the same unit.

## User Review Required

> [!IMPORTANT]
> **Field naming strategy**: I propose keeping the existing Firestore field names (`paragraphImages`, `paragraphAudioUrls`, `paragraphAudioErrors`) even in sentence mode. They're just arrays indexed by segment. Renaming them would break all existing conversations and require Firestore rules changes. The internal code will use "segment" terminology, but the persisted field names stay the same.

> [!WARNING]
> **Sentence mode cost warning**: In sentence mode, a single 5-paragraph message with ~3 sentences per paragraph would generate ~15 images and ~15 audio clips instead of 5. The UI should display an explicit warning about this.

> [!IMPORTANT]
> **`Intl.Segmenter` for sentence splitting**: This is a built-in browser API (Chrome 87+, Firefox 125+, Safari 15.4+) that handles abbreviations, decimals, URLs etc. properly. No polyfill needed. However, it operates on plain text, so the segmentation pipeline needs to: strip Markdown → segment sentences → map back. Code blocks, list items, and headings will be kept atomic (not split into sentences).

> [!IMPORTANT]
> **Scope is image gen + browser TTS + LocalAI TTS only**. Cloud/server TTS is not currently active. The plan does not touch backend TTS.

---

## Proposed Changes

### Segmentation Utility

Summary: Create the core segmentation function that all systems consume. This is the single source of truth for what constitutes a "segment" at any given granularity.

#### [NEW] [segment-utils.ts](file:///Users/hughculling/Two%20AIs/two-ais/src/lib/segment-utils.ts)

New file exporting:

```typescript
type MediaGranularity = 'paragraph' | 'sentence';

interface MediaSegment {
  text: string;           // The raw text of this segment (may contain Markdown)
  segmentIndex: number;   // Flat index across the whole message (0, 1, 2, ...)
  paragraphIndex: number; // Which original paragraph this came from
  sentenceIndex: number;  // Sentence index within the paragraph (0 for paragraph mode)
}

function splitIntoMediaSegments(
  content: string,
  granularity: MediaGranularity
): MediaSegment[]
```

**Paragraph mode** (`granularity === 'paragraph'`):
- Splits by `\n+` exactly like the current `splitIntoParagraphs()` — each paragraph is one segment.

**Sentence mode** (`granularity === 'sentence'`):
- First splits into paragraphs by `\n+`.
- For each paragraph, checks if it is "atomic" content that shouldn't be sentence-split:
  - Code blocks (starts with `` ``` `` or 4-space indent)
  - List items (starts with `- `, `* `, `1. `, etc.)
  - Headings (starts with `#`)
  - Very short paragraphs (fewer than ~20 chars, unlikely to contain multiple sentences)
- Atomic paragraphs become a single segment.
- Non-atomic paragraphs are sentence-split using `Intl.Segmenter('en', { granularity: 'sentence' })` on the plain-text version, then the sentence boundaries are mapped back to the original Markdown text.
- Each sentence becomes a separate segment.

This file will also export a helper `getMediaGranularity(conversationData)` that safely reads the setting with `'paragraph'` as the default for backward compatibility.

#### [MODIFY] [tts-utils.ts](file:///Users/hughculling/Two%20AIs/two-ais/src/lib/tts-utils.ts)

No breaking changes. `splitIntoParagraphs()` and `splitIntoTTSChunks()` remain as-is for backward compat. The new `segment-utils.ts` is a separate module that imports `splitIntoParagraphs` internally.

---

### Session Setup Form

Summary: Add an "Image cadence" control inside the existing text-to-image settings section.

#### [MODIFY] [SessionSetupForm.tsx](file:///Users/hughculling/Two%20AIs/two-ais/src/components/session/SessionSetupForm.tsx)

- Add new state: `const [mediaGranularity, setMediaGranularity] = useState<'paragraph' | 'sentence'>('paragraph');`
- Add a toggle/radio group in the image generation settings area (near the existing InvokeAI controls), labeled **"Image cadence"** with two options:
  - **Per paragraph** (default) — "One image per paragraph. Calmer pacing, fewer images."
  - **Per sentence** — "One image per sentence. More cinematic, but generates many more images and audio clips."
- When "Per sentence" is selected, show an amber warning:
  > "Sentence mode can generate 3–15× more images and audio clips per message, and will take longer."
- Include `mediaGranularity` in the `imageGenSettings` object passed to `onStartSession()`:
  ```typescript
  imageGenSettings = {
    ...existingFields,
    mediaGranularity: mediaGranularity, // 'paragraph' | 'sentence'
  };
  ```
- Update preset save/load to persist and restore `mediaGranularity`.

#### [MODIFY] [sessionPreset.ts](file:///Users/hughculling/Two%20AIs/two-ais/src/lib/firebase/sessionPreset.ts)

- Add `mediaGranularity?: 'paragraph' | 'sentence'` to the `imageGenSettings` shape in the `SessionPreset` interface.

---

### Image Generation Hook

Summary: Make the image generation hook split content by the configured granularity instead of always by paragraph.

#### [MODIFY] [useInvokeAIImageGen.ts](file:///Users/hughculling/Two%20AIs/two-ais/src/hooks/useInvokeAIImageGen.ts)

- Import `splitIntoMediaSegments` and `getMediaGranularity` from `@/lib/segment-utils`.
- Add `mediaGranularity` to the `ConversationData` and `imageGenSettings` interfaces.
- Replace `splitIntoParagraphs(messageData.content)` (line 278) with `splitIntoMediaSegments(messageData.content, granularity)`.
- The queue items continue to use `paragraphIndex` internally (it's really `segmentIndex` now, but the variable name doesn't matter for behavior — it's just an array index).  
- The `paragraphImages` Firestore array is now indexed by segment. Each `ParagraphImage.paragraphIndex` becomes the segment index.
- The prompt system message `{paragraph}` placeholder will be replaced with the segment text (which might be a sentence). No change to the replacement logic — just the input text is shorter.
- Storage path remains `${messageId}_${segmentIndex}.png`.

---

### LocalAI TTS Generation Hook

Summary: Make TTS generation split by segments instead of always by paragraphs.

#### [MODIFY] [useLocalAITTSGen.ts](file:///Users/hughculling/Two%20AIs/two-ais/src/hooks/useLocalAITTSGen.ts)

- Import `splitIntoMediaSegments` and `getMediaGranularity`.
- The hook needs access to image gen settings to know the granularity. Currently it only reads `ttsSettings` and `localaiEndpoint` from the conversation doc. Add reading of `imageGenSettings.mediaGranularity` from the conversation data.
- Replace `splitIntoParagraphs(messageData.content)` (line 267) with `splitIntoMediaSegments(messageData.content, granularity)`.
- `paragraphAudioUrls` array is now indexed by segment. Same array, different segment count.
- Storage path remains `${messageId}_${segmentIndex}.ext`.

---

### ChatInterface — Playback & Rendering

Summary: The largest change. Update the TTS playback logic, DOM rendering, and gallery sync to use segments.

#### [MODIFY] [ChatInterface.tsx](file:///Users/hughculling/Two%20AIs/two-ais/src/components/chat/ChatInterface.tsx)

**Interfaces (lines 43-63)**
- Add `mediaGranularity` to the `ConversationData` interface's `imageGenSettings`.
- No changes to the `ParagraphImage` or `Message` interfaces (field names stay).

**Helper functions (lines 246-265)**
- Add a new helper alongside `splitIntoParagraphs`:
  ```typescript
  const getSegments = useCallback((content: string): MediaSegment[] => {
    const granularity = getMediaGranularity(conversationData);
    return splitIntoMediaSegments(content, granularity);
  }, [conversationData]);
  ```

**Browser TTS playback (lines 1384-1737)**
- Currently: splits into paragraphs → filters speakable → splits into TTS chunks → plays sequentially, gating each chunk on `paragraphImages[rawParagraphIndex]`.
- Change: split into segments → filter speakable → split into TTS chunks → play sequentially, gating each chunk on `paragraphImages[segmentIndex]`.
- In sentence mode, each sentence is spoken individually as one TTS utterance (no further splitting needed since sentences are short). The `splitIntoTTSChunks` 4000-char chunking is kept as a safety net but will rarely trigger.
- Auto-scroll refs change from `${msgId}-p${paragraphIndex}` to `${msgId}-s${segmentIndex}` when in sentence mode. But for backward compat, paragraph mode still uses `-p${index}`.

**LocalAI TTS playback (lines 1739-1918)**
- Same pattern: use segment indices instead of paragraph indices for audio URL lookup and image gating.

**TTS initial readiness check (lines 1328-1358)**
- Currently waits for `paragraphImages` to be initialized and first speakable paragraph image to be ready.
- Change: wait for first speakable *segment* image to be ready.

**DOM rendering (lines 2345-2415)**
- Currently: `msg.content.split(/\n+/).map((paragraph, index) => ...)` with `paragraphImages[index]` inline.
- Change: In paragraph mode, keep exact current behavior. In sentence mode:
  - First split by `\n+` into paragraphs (for Markdown rendering structure).
  - Within each paragraph, split into sentence segments.
  - Render each sentence in its own `<div>` with its own `paragraphImages[segmentIndex]` image below it.
  - Paragraph refs for auto-scroll become segment refs.

**Gallery sync (lines 1284-1305, 2596+)**
- `fullScreenGallery` and `fullscreenAudioSync` currently use `paragraphIndex`. They will use `segmentIndex` — same field, just different meaning depending on granularity.
- The gallery navigation (prev/next) already iterates over the `paragraphImages` array, which will now have more entries in sentence mode. No structural change needed.

---

### History Page

Summary: Ensure old and new conversations render correctly in the history viewer.

#### [MODIFY] [page.tsx](file:///Users/hughculling/Two%20AIs/two-ais/src/app/[lang]/app/history/[conversationId]/page.tsx)

- The history viewer uses `msg.content.split(/\n+/)` for rendering with paragraph images. 
- Add the same segment-aware rendering logic: read `mediaGranularity` from `details.imageGenSettings`, and split accordingly.
- Browser TTS and LocalAI TTS playback in history viewer also need segment-aware splitting for proper auto-scroll in sentence-mode conversations.

#### [MODIFY] [route.ts](file:///Users/hughculling/Two%20AIs/two-ais/src/app/api/conversation/[conversationId]/details/route.ts)

- Pass through `imageGenSettings.mediaGranularity` in the conversation details response (already happens since `imageGenSettings` is passed as-is from Firestore, but update the TypeScript interface to include it).

---

### Firestore Rules

#### [NO CHANGE] [firestore.rules](file:///Users/hughculling/Two%20AIs/two-ais/firestore.rules)

No changes needed. The allowed client-writable fields remain `paragraphImages`, `paragraphAudioUrls`, `paragraphAudioErrors`. The field names don't change, only the array length differs.

---

### Tests

#### [MODIFY] [tts-utils.test.ts](file:///Users/hughculling/Two%20AIs/two-ais/src/lib/tts-utils.test.ts)

- Existing tests remain untouched (they test `splitIntoParagraphs` which is unchanged).

#### [NEW] [segment-utils.test.ts](file:///Users/hughculling/Two%20AIs/two-ais/src/lib/segment-utils.test.ts)

New test file covering:
- Paragraph mode returns same results as `splitIntoParagraphs`.
- Sentence mode correctly splits multi-sentence paragraphs.
- Code blocks, list items, headings are kept atomic in sentence mode.
- Abbreviations like "Dr.", "U.S.A.", "e.g." don't cause false splits (validates `Intl.Segmenter` behavior).
- Empty content, single-sentence paragraphs, mixed content.
- `segmentIndex` is contiguous across paragraph boundaries.

---

## Open Questions

> [!IMPORTANT]
> **Locale for `Intl.Segmenter`**: The app supports multiple languages. Should I use the conversation's configured language for `Intl.Segmenter` instead of hardcoding `'en'`? For example, `new Intl.Segmenter(conversationData.language || 'en', { granularity: 'sentence' })`. This would improve sentence splitting accuracy for non-English conversations. The downside is that the segmentation utility would need access to the language setting. **I'd recommend yes — pass the language through.**

> [!IMPORTANT]
> **Image prompt template**: The current default prompt system message says "based on this paragraph: {paragraph}". In sentence mode, should we:
> - A) Keep `{paragraph}` as the placeholder name (it just receives sentence text instead) — simplest, but confusing to users.
> - B) Add a `{text}` alias that always works — cleaner.
> - C) Change the default to say "based on this text: {text}" — cleanest but changes the default for existing users.
> 
> **I'd recommend (B)**: support both `{paragraph}` and `{text}`, change the default template to use `{text}`.

---

## Verification Plan

### Automated Tests
- `npm test -- segment-utils.test.ts` — new segmentation tests.
- `npm test -- tts-utils.test.ts` — confirm existing tests still pass.
- `npm run build` — confirm no TypeScript errors.

### Browser Testing
1. **Paragraph mode (regression)**: Start a session with image gen enabled, default paragraph cadence. Verify images generate per paragraph, TTS syncs with images, gallery works. Same as current behavior.
2. **Sentence mode**: Start a session with sentence cadence. Verify:
   - Images generate per sentence (more images per message).
   - Browser TTS speaks one sentence at a time, gated on each sentence's image.
   - LocalAI TTS plays one sentence audio clip at a time, gated on images.
   - Auto-scroll scrolls to each sentence as it's spoken.
   - Gallery shows all sentence images and navigates correctly.
   - Fullscreen image syncs to the currently playing sentence.
3. **Mixed content**: Send a message with code blocks, lists, and normal prose in sentence mode. Verify code blocks and lists aren't split into sentences.
4. **History viewer**: Load a sentence-mode conversation from history. Verify images render correctly and TTS auto-scroll works.
5. **Backward compat**: Load an existing paragraph-mode conversation from history. Verify everything still works.
6. **Preset save/load**: Save a preset with sentence mode enabled, reload it, confirm the setting persists.
