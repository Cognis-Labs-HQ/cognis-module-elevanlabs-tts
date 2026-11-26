# Usage

Generate spoken audio with a configured ElevenLabs account for authorized Cognis features.

## Prerequisites

An administrator needs an ElevenLabs API key, an available voice and network access to the provider. Previewing settings does not save them.

## Examples

Open the module’s administrator Settings, enter the key and choose a voice. Generate and play test audio, then explicitly save the configuration and enable the module for consumers.

### Usage

```js
const speech = ctx.getCapability("elevenlabs-tts:synthesis");
const audio = await speech.synthesize(
    { text: phrase, language, voiceId },
    signal,
);
```

The administrator guide starts on the ElevenLabs detail page. Clicking Settings opens a branch for the API key, default voice, voice discovery, test phrase, audio generation and optional playback. Next without opening Settings bypasses the branch. Controls are resolved through the host’s public module-target contract, never by inspecting foreign popup markup. Tutorial completion and credentials remain unchanged by registration.

## Expected Results

A valid preview returns playable audio. General synthesis becomes ready only after a key and default voice are saved; an absent or disabled provider does not replace uploaded recordings.

## Troubleshooting

If voice discovery fails, verify provider access and credentials or enter a known voice ID manually. Unsupported languages, excessive text and provider errors reject generation rather than returning invented audio.
