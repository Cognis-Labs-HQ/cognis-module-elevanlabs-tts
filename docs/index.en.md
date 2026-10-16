# ElevenLabs Speech

Configure the module from the administrator configuration popup, including while disabled. Enter an ElevenLabs API key, discover voices and choose the default voice, or enter its ID manually if discovery is unavailable. Generate test audio from the current, unsaved settings before saving. The API key is concealed on reads and survives restart and disable; deleting module content removes it.

## Usage

```js
const speech = ctx.getCapability("speech:synthesis");
const audio = await speech.synthesize(
    { text: phrase, language, voiceId },
    signal,
);
```

## Technical specification

The enabled module publishes `speech:synthesis`. Call `synthesize({ text, language?, voiceId?, phonemes? }, signal?)` to receive `{ mediaType, data }`. Omitting `voiceId` uses the configured default. `revision` changes after configuration is saved so callers can invalidate their caches. English IPA phonemes use SSML; other speech uses the multilingual model. Requests accept at most 5000 characters and return bounded MP3 audio. Provider requests use a fixed HTTPS origin, reject redirects, and have a timeout; teardown cancels outstanding requests. Logs exclude API keys, text and audio.

Configuration routes use `/api/v1/modules/elevenlabs-tts/config`: administrator-only GET, PUT and DELETE, plus POST `/voices` (paginated discovery) and `/test` (audio preview). Both actions accept current form values, retaining the concealed stored key when omitted. Only configuration routes run while disabled. Persistence uses `db:executor`; no database driver is bundled.

The speech capability has no Study-specific policy. Callers enforce authorization and namespace rules before requesting speech. Cognis Study generates speech only for saved global cards; private and classroom cards accept recordings or compose existing constituent audio. This repository contains no language content packs.

`npm install` · `npm run lint` · `npm test` · `npm run manifest:hashes` · `npm run check:manifest`
