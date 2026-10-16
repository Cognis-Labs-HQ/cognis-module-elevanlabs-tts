# Vorlage für externe Cognis-Module

[English](README.en.md) · **Deutsch** · [Bahasa Indonesia](README.id.md) · [日本語](README.ja.md)

Erstellen Sie jedes neue externe Cognis-Modul aus diesem Repository. Das installierbare Beispiel zeigt UI, API, Datenbank, CLI, Fähigkeiten, Flows, Lokalisierung, Lebenszyklustests und Paketintegrität. Ersetzen Sie Beispielidentität und Inhalte, behalten Sie Beitragsstandard und Prüfungen.

## Erste Schritte

```sh
npm install
npm test
npm run check:manifest
```

Installiere das Repository als Cognis-Modulquelle, prüfe seine Berechtigungen, aktiviere es und öffne anschließend `/showcase` oder führe `cognisctl modules:module-template:list` aus.

## Architekturübersicht

| Pfad            | Verantwortung                                                                                             | Wichtigste Erkenntnis                                                        |
| --------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `manifest.json` | Identität, Kompatibilität, Capabilities, Einstiegspunkte, Speichermetadaten, unveränderliche Datei-Hashes | UUIDs sind Abhängigkeiten; IDs sind menschenlesbar                           |
| `bootstrap.js`  | Einziger Integrationspunkt zum Host                                                                       | Über `ctx` registrieren; niemals Cognis-Interna importieren                  |
| `routes.json`   | Vorabdeklaration des Seitenzugriffs                                                                       | Der Host validiert geschützte Routen vor der Aktivierung                     |
| `api/index.js`  | Authentifizierte HTTP-Grenze und Orchestrierung                                                           | Eingaben validieren und Persistenz delegieren                                |
| `api/store.js`  | Portable Datenbank-Executor-Befehle und Schema                                                            | Ein Modul niemals an einen Datenbanktreiber binden                           |
| `api/ui.js`     | Statische Assets, SPA-Route, Navigation                                                                   | Host-Registrierung begrenzt die Bereinigung beim Deaktivieren/Deinstallieren |
| `ui/`           | Browser-Einstiegspunkt, Styling, vier Sprachpakete                                                        | `ui.stringsBaseUrl` setzen; Host-Routen und -Toasts verwenden                |
| `cli/index.js`  | Erweiterung für `cognisctl`                                                                               | Die CLI ruft die öffentliche API auf, statt sie zu umgehen                   |
| `docs/`         | Vertiefungen für Mitwirkende                                                                              | Verträge und sichere Erweiterungsmuster erklären                             |
| `scripts/`      | Prüfungen der Paketintegrität                                                                             | Jede ausgelieferte Datei besitzt einen SHA-256-Hash                          |

## Lebenszyklus und Grenzen

1. Cognis validiert `manifest.json`, Komponentenabhängigkeiten, Capability-Anforderungen, Routen und Datei-Hashes.
2. Beim Aktivieren wird `bootstrapModule(ctx)` aufgerufen. Das Modul registriert UI/API-Beiträge, veröffentlicht eine Capability und erweitert einen Flow.
3. API-Handler authentifizieren und validieren. Der Store verwaltet Schema und Persistenz über `db:executor`.
4. UI und CLI verwenden dieselbe HTTP-API. Andere Komponenten können `module-template:listItems` über `ctx` nutzen.
5. Bereichsgebundene Registrierungen werden beim Deaktivieren entfernt. Erstelle und liefere einen expliziten Disposer zurück, wenn du Timer, Listener, Sockets oder andere Ressourcen außerhalb solcher Registrierungen anlegst.
6. Beim Deinstallieren wird `uninstallModule(ctx, { deleteContent })` aufgerufen; die Vorlage löscht ihre Datenbankzeilen nur, wenn die Administration das Löschen der Inhalte anfordert.

Komponentenübergreifendes Verhalten gehört in **Capabilities** (ein aufrufbarer Vertrag) oder **Flows** (geordnete Erweiterungsstufen). Greife nicht auf Cognis, Gateways oder Quellbäume benachbarter Module zu. Erforderliche Komponentenverknüpfungen in `requires` sind UUIDs; Laufzeitverträge gehören in `requiresCapabilities`.

## Diese Vorlage forken

1. Wähle eine stabile, lesbare ID und generiere einmalig eine neue UUID. Verwende die UUID dieser Vorlage niemals in einem veröffentlichten Fork.
2. Benenne Paket, Befehl, API-/Static-Pfade, DB-Tabellenpräfix, Lokalisierungs-Namespace, Flow-Erweiterungs-IDs und Capability-Schlüssel um.
3. Ersetze Publisher-, Repository- und Support-Metadaten sowie Grafiken.
4. Halte die Versionen in Manifest, Paket und Lockfile identisch und setze `ui.stringsBaseUrl` im Manifest auf die Basis-URL der Sprachpakete des Moduls.
5. Füge nur tatsächlich benötigte Capabilities hinzu und halte den Routenzugriff minimal.
6. Führe zuletzt `npm run manifest:hashes`, danach `npm run check` und `git diff --check` aus.

Lies vor der Implementierung eines Produktionsmoduls [`docs/index.de.md`](docs/index.de.md); gleichwertige englische, indonesische und japanische Referenzen befinden sich daneben.

## Qualitätsprüfungen für Mitwirkende

Diese Vorlage enthält dieselben automatisierten Leitplanken wie das Jitsi-Meet-Modul: Prettier-Formatierung, Lesbarkeitsgrenzen, Strukturprüfungen für externe Module, Parität der Dokumentationsvorlagen und Prüfungen auf mehrdeutige Namen.

```sh
npm install
npm run lint
npm test
npm run check:manifest
git diff --check
```

Neue Vertragsdokumentation kann mit den lokalisierten Vorlagen in `.github/DOCUMENTATION_TEMPLATE.<language>.md` beginnen. Halte alle vier Varianten strukturell synchron.
