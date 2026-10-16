# ElevenLabs Sprache

Das Modul wird im Konfigurationsdialog für Administratoren eingerichtet, auch im deaktivierten Zustand. Einen ElevenLabs-API-Schlüssel eingeben, Stimmen suchen und eine Standardstimme wählen oder ihre ID manuell eingeben. Testaudio verwendet die aktuellen, noch nicht gespeicherten Einstellungen. Der Schlüssel wird bei Lesezugriffen verborgen und bleibt nach Neustart und Deaktivierung erhalten; beim Löschen der Modulinhalte wird er entfernt.

## Nutzung

```js
const speech = ctx.getCapability("speech:synthesis");
const audio = await speech.synthesize(
    { text: phrase, language, voiceId },
    signal,
);
```

## Technische Spezifikation

Das aktivierte Modul veröffentlicht `speech:synthesis`. `synthesize({ text, language?, voiceId?, phonemes? }, signal?)` liefert `{ mediaType, data }`. Ohne `voiceId` gilt die Standardstimme. `revision` ändert sich nach dem Speichern zur Cache-Invalidierung. Englische IPA-Angaben verwenden SSML mit `eleven_turbo_v2`. Explizite Sprachangaben nutzen `eleven_flash_v2_5`, das unterstützte Sprachcodes berücksichtigt. Nicht unterstützte Codes werden vor der Anfrage abgelehnt. Ohne Sprachangabe erkennt `eleven_multilingual_v2` die Sprache automatisch. Höchstens 5000 Zeichen und begrenzte MP3-Ausgaben sind erlaubt. Anfragen nutzen einen festen HTTPS-Ursprung ohne Weiterleitungen und mit Zeitlimit; beim Abbau werden laufende Anfragen abgebrochen. Protokolle enthalten weder Schlüssel noch Text oder Audio.

Unter `/api/v1/modules/elevenlabs-tts/config` stehen GET, PUT, DELETE und POST `/voices` (paginierte Suche) sowie `/test` (Audiovorschau) nur Administratoren zur Verfügung. Die Aktionen akzeptieren aktuelle Formularwerte und behalten einen ausgelassenen gespeicherten Schlüssel. Deaktiviert laufen nur Konfigurationsrouten. Die Speicherung verwendet `db:executor` ohne gebündelten Datenbanktreiber.

Die Sprachfunktion enthält keine Study-Regeln. Aufrufer prüfen Berechtigungen und Namensräume vor der Synthese. Cognis Study erzeugt Sprache nur für gespeicherte globale Karten; private und Klassenkarten erlauben Aufnahmen oder Zusammensetzung vorhandener Aufnahmen. Dieses Repository enthält keine Sprachpakete.

`npm install` · `npm run lint` · `npm test` · `npm run manifest:hashes` · `npm run check:manifest`

Stimmen lassen sich über `cognisctl modules:elevenlabs-tts:voices` suchen. Der Befehl nutzt die gespeicherte Konfiguration und die authentifizierte, nur für Administratoren zugängliche Route `/config/voices` einschließlich der Anbieter-Paginierung. Die CLI-Hilfe unterstützt derzeit nur wörtliche Beschreibungen; Meldungen zu Sprache und Konfiguration werden vom Host lokalisiert. Die Modulbilder verwenden das ElevenLabs-Zeichen der offiziellen Website und ein gemeinsames Cognis/ElevenLabs-Banner.

Audioantworten sind für die Eingabegrenze von 5000 Zeichen bei 128 kbps auf 64 MiB begrenzt. Beim Speichern müssen nach dem Zusammenführen unveränderter maskierter Werte ein API-Schlüssel und eine Standardstimme vorhanden sein. Testsätze bleiben flüchtig: Speichern schließt sie aus, Lesezugriffe liefern ein leeres Feld, und beim Laden früherer Einstellungen werden gespeicherte Testsätze entfernt. Deaktiviert werden nur Administrations-Flows registriert, niemals `elevenlabs-tts:synthesize`. Abgelehnte Anbieterantworten werden vor der Rückgabe stabiler Fehler abgebrochen.

Der Vertrag des Hosts für verdeckte Werte maskiert Zugangsdaten bei API-Lesezugriffen. Er stellt weder verschlüsselte Speicherung noch einen Geheimnisspeicher mit undurchsichtigen Referenzen bereit. API-Schlüssel bleiben in der Konfigurationsdatenbank des Moduls. Die Voraussetzung für hostseitige Speicherung ist in [TODO.md](TODO.md) erfasst.
