# Gemeinsame Sprachsynthese

**Feature-Zweig:** feature-elevenlabs-synthesis

## Nutzung

ElevenLabs-Synthese in ein eigenes konfigurierbares Modul verlagern. Study nutzt optionale sprachbezogene Stimmen für gespeicherte globale Karten. Private und Klassenkarten erlauben begrenzte Uploads und Mikrofonaufnahmen. Die kontinuierliche Satzkomposition aus vorhandenen Aufnahmen bleibt als Rückfall erhalten. Administratoren können globale Audios im Editor neu erzeugen.

## Study-Aktivierung reparieren

Die tatsächlichen englischen und japanischen Inhaltspaketversionen beim Entfernen gebündelter Aufnahmen erhöhen. Unabhängige Module werden vor der Fehlermeldung vollständig abgeglichen, damit Einwilligungsrouten ihre registrierten Flows behalten.

## Anbieterbilder und CLI

Das offizielle ElevenLabs-Logo dient als scharfes SVG-Symbol; ein gemeinsames Cognis/ElevenLabs-Banner ergänzt es. Release-Dateien folgen dem deklarierten Feature-Zweig. Der installierte Befehl `cognisctl modules:elevenlabs-tts:voices` sucht Stimmen über die authentifizierte öffentliche Konfigurations-API.

## Prüfung der Konfigurationsgrenze

Fehlerhafte Konfigurationsanfragen ohne ihren Inhalt protokollieren, zu große Anfragen mit HTTP 413 ablehnen und ungültige Einstellungen von Anbieterfehlern unterscheiden. Den fest vorgegebenen Testsatz entfernen und alle bestehenden Überschriften der Entwicklerdokumentation beibehalten.

## Explizite Sprachen beachten

Flash v2.5 für explizite unterstützte Sprachangaben verwenden, englische IPA-Synthese erhalten und nicht unterstützte Sprachcodes vor Anbieteranfragen ablehnen.

## Testsätze flüchtig halten

Testsätze nicht in Einstellungen speichern, bereits gespeicherte Testtexte beim Laden entfernen und unvollständige Konfigurationen ohne Änderung gespeicherter Werte ablehnen.

## Operative Sprach-Flows deaktivieren

Im deaktivierten Zustand nur den Konfigurationsdienst laden. Stimmensuche und Testvorschau für Administratoren bleiben verfügbar; der allgemeine Synthese-Flow wird nicht registriert.

## Anbieterantworten begrenzen und freigeben

Für akzeptierte lange Texte bis zu 64 MiB MP3-Audio erlauben. Fehlerantworten und Antworten mit ungültigem Medientyp vor der Rückgabe stabiler Fehler abbrechen.

## Voraussetzung für Zugangsdaten

Der vorhandene Hostvertrag maskiert Konfigurationsantworten, bietet aber keinen Zugangsdaten-Speicher mit undurchsichtigen Referenzen. Sichere hostseitige Speicherung bleibt in [Cognis #515](https://github.com/Cognis-Labs-HQ/Cognis/issues/515) offen; der API-Schlüssel liegt weiterhin in der Konfigurationsdatenbank.

## Sprache ohne Sonderrechte bereitstellen

`elevenlabs-tts:synthesis` im eigenen Modulnamensraum veröffentlichen und die Privilegien-Markierung entfernen. English und Japanese Study lösen diese Fähigkeit über ctx und ihre bestehende optionale Modulabhängigkeit auf. Die Study-Brücke erhält den aktuellen Fähigkeitszugriff vom Aufrufer und bewahrt Deaktivierung, erneute Aktivierung und konfigurierte Stimmen.

## Commits

- [fc07131](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/fc071312db5bc106977928dc96b7a082c9db1cb8)
- [49e24af](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/49e24af7ea4dec01c4d173fcdc4d9ddc18fffe8f)
- [fa92c9b](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/fa92c9b607e5a21abc2db3b63c231fa32888b378)
- [dd89029](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/dd890299216d6f2ebe0fa6caf41103f64cfcde8f)
- [0f0f782](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/0f0f782c697f80b86c1836da649172d47c3d4108)
