export const DEFAULT_TURN_TRANSFORM_PROMPT = [
    'Convert the following story turn into a single script-style passage.',
    '',
    'Include dialogue, narration, and brief visual storyboard cues where useful.',
    'Keep it as one continuous document, not separate script and storyboard documents.',
    'Do not add analysis or commentary.',
    'Keep the meaning of the original turn.',
    'When adding image prompts or storyboard cues, make them short, concrete, and suitable for Pixabay-style search keywords.',
    'If a cue describes a character-focused image, prefer one visible person unless the original turn clearly requires more.',
    '',
    'Story turn:',
    '{turn}',
].join('\n');

export interface TurnTransformSettings {
    enabled: boolean;
    llm: string;
    prompt: string;
}

export interface TurnTransformMetadata {
    status: 'done' | 'error' | 'disabled';
    model?: string;
    prompt?: string;
    error?: string;
}
