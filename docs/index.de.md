# Vorlage für externe Module

Erstellen Sie jedes neue externe Cognis-Modul aus diesem Repository. Das installierbare Beispiel zeigt UI, API, Datenbank, CLI, Fähigkeiten, Flows, Lokalisierung, Lebenszyklustests und Paketintegrität. Ersetzen Sie Beispielidentität und Inhalte, behalten Sie Beitragsstandard und Prüfungen.

## Anwendungsbeispiele

- Öffnen Sie nach der Aktivierung `/showcase`, um die lokalisierte Page-Composer-Oberfläche zu verwenden.
- Führen Sie `cognisctl modules:module-template:list` aus, um dieselbe authentifizierte API über die CLI zu nutzen.
- Lösen Sie `module-template:listItems` über `ctx` auf, statt Modulinterna zu importieren.
- Erweitern Sie den Flow `module-template:listItems` durch eine benannte, entfernbare Stufe.
- Deaktivieren und reaktivieren Sie das Modul, um wiederholbare Registrierungen zu prüfen.

## Technische Spezifikation

Die folgenden Regeln bündeln den Core-Laufzeitvertrag und in benachbarten Cognis-Modulen bewährte Muster.

### Repository- und Manifestvertrag

- Ein Repository liefert genau ein Modul. `manifest.json`, `package.json`, `routes.json` und `bootstrap.js` bleiben im Stammverzeichnis.
- Bewahren Sie die UUID dauerhaft und verwenden Sie UUIDs für erforderliche Komponenten. Manifest-, Paket- und Lockfile-Version bleiben synchron.
- Deklarieren Sie exakte repository-relative Einstiegspunkte und Assets. `routes.json` bleibt ein Array und `package.json` ein ES-Modul-Paket.
- Setzen Sie `ui.stringsBaseUrl`, verwenden Sie kleingeschriebene, punktgetrennte Lokalisierungsschlüssel und halten Sie Deutsch, Englisch, Indonesisch und Japanisch schlüsselgleich.
- Deklarieren Sie nur erforderliche Routen, Capabilities, Abhängigkeiten und Rechte. Erzeugen Sie `manifest.files` zuletzt neu. Manifest, `docs/changelog/`, der optionale Kompatibilitätsalias `README.md` im Stammverzeichnis sowie alle symbolischen Links und anderen nicht regulären Einträge bleiben ausgeschlossen. Lokalisierte README-Dateien bleiben reguläre Paketdateien.

### Isolation und Lebenszyklus

- `bootstrap.js` orchestriert jede Host-Integration über das bereichsgebundene `ctx`; Feature-Implementierung und Cognis-interne Importe gehören nicht hinein.
- Capabilities sind neutrale Verträge. Nicht privilegierte Module stellen beigetragenen Capability- und Flow-IDs ihre Manifest-ID voran; doppelpunktgetrennte Segmente verwenden camelCase. Optionale Komponenten werden per Capability erkannt.
- Wesentliche Orchestrierung verwendet benannte Flows und stabile, entfernbare Stufen. Routen validieren und koordinieren; Capabilities führen anbieterspezifische Arbeit aus.
- Ein Disposer oder `teardownModule` entfernt ungebundene Timer, Listener, Sockets und Skripte. `uninstallModule(ctx, { deleteContent })` erhält externe Inhalte, sofern deren Löschung nicht ausdrücklich verlangt wurde.
- Prüfen Sie Installation, Aktivieren–Deaktivieren–Aktivieren und Deinstallation. Keine Route, Asset-Registrierung, UI-Erweiterung, Capability oder Flow-Stufe darf über einen Zyklus hinaus bestehen.

### UI und Host-Eigentum

- Erstellen Sie Seiten mit dem Host-Page-Composer und navigieren Sie über den Host-Router. Links dienen der Navigation, Schaltflächen Aktionen.
- Ein Modul gestaltet nur eigene Nachfahren seines Mount-Roots. Shell, `document.body`, `document.head` und Host-Klassen werden nicht verändert.
- Beziehen Sie gemeinsame UI-Bausteine und Stile über `ui:reuse`; laden Sie Laufzeitskripte über `ui:resourceLoader` und geben Sie Handles frei.
- Nutzen Sie Host-Verträge für Toasts, Fehler-/Entscheidungsdialoge, Zeitstempel, Theme, Schrift, Avatar und Fokus. Keine Browserdialoge, Reload-Navigation, beliebigen Statusknoten, CSS-Kommentare oder kopierten Host-Stile.
- Lokalisieren Sie sichtbare und barrierefreie Texte in allen vier XML-Paketen. Bevorzugen Sie themefähige SVGs gegenüber Emoji und Plattformglyphen.

### API, Daten und Konfiguration

- Validieren, normalisieren, authentifizieren und autorisieren Sie an der Grenze vor der Geschäftslogik. Antworten verwenden stabile Fehler ohne interne Details.
- Speicherzugriff bleibt hinter `ctx`-Executors und moduleigenen Stores; Abfragen sind parametrisiert und Schemaobjekte namensräumlich getrennt. Keine konkreten Treiber importieren.
- Erfinden Sie kein Ergebnislimit, wenn der Aufrufer keines angibt. Explizite Limits werden validiert, nicht still begrenzt.
- Nutzen Sie Manifest-`ui.preferences` und die Modulkonfigurations-API statt einer zweiten Einstellungsseite. Konfiguration übersteht Deaktivierung/Neustart; gespeicherte Passwörter werden nie zurückgegeben.
- Benutzerspezifische Geheimnisse gehören in den Host-Keyring. IDs und Geheimnisse entstehen mit Web Crypto oder Node Crypto, nie mit `Math.random()`.
- Protokollieren Sie Zustandsänderungen als `info`, abgefangene Fehler als `error` mit sicheren strukturierten Daten und unbehandelte Fehler als fatal. Beabsichtigte Fallbacks bleiben nie still.

### Struktur und Qualität

- Server, Browser, CLI, Dokumentation, Daten, Werkzeuge und Artwork gehören jeweils nach `api/`, `ui/`, `cli/`, `docs/`, `data/`, `scripts/` oder `tooling/` und `assets/`.
- Wirklich schichtweit wiederverwendbarer Code gehört in `reuse/`; Feature-Code bleibt beim Eigentümer. Verzeichnisse `shared`, `utils`, `helpers` und `common` vermeiden.
- Dateien bleiben kohärent und höchstens 1000 Zeilen lang. Verwenden Sie aussagekräftige Namen, lesbaren Kontrollfluss, hilfreiche Einschränkungskommentare und keine veralteten Kompatibilitätsschichten.
- Tests laufen eigenständig mit lokalen `ctx`-Fakes und decken öffentliche APIs, Capabilities, Flows, Autorisierung, Lokalisierung, Lebenszyklus und Manifestintegrität ab.

### Freigabe-Checkliste

1. Prüfen Sie Abhängigkeits-UUIDs, erforderliche Capabilities, Routenzugriff, Metadaten, Übersetzungen, Artwork und Geheimnisbehandlung.
2. Synchronisieren Sie bei Vertrags-, Code-, Schema- oder API-Änderungen Manifest-, Paket- und Lockfile-Version.
3. Führen Sie `npm install`, `npm run lint` und `npm test` aus.
4. Führen Sie nach der letzten ausgelieferten Dateiänderung `npm run manifest:hashes`, danach `npm run check:manifest` und `git diff --check` aus.
5. Fügen Sie bei Nicht-Vorlagenmodulen vier lokalisierte `docs/changelog/<branch>.<lang>.md` hinzu und vervollständigen Sie deren Commit-Provenienz ohne Changelog-Digests.

Jedes neue externe Modul beginnt mit dieser Vorlage. Einmalig eine eigene Produkt-UUID erzeugen, Beispielmetadaten und Namensräume ersetzen, AGENTS.md und Prüfwerkzeuge behalten. Domänenrouten liegen in `api/routes/<domain>/`, Styles in `ui/styles/`, Markup in `ui/templates/` und Release-Notizen in `docs/changelog/`. API-Lese- und Schreibaktionen durchlaufen registrierte Stufen; Browserseiten nutzen Page Composer und begrenzte Navigation.

Einstiegspunkte und Bildziele müssen reguläre Dateien innerhalb des Checkouts sein, auch nach Pfadauflösung. Diese Ziele werden vor Inventar-Hashes geprüft. Entwicklerdokumente beschreiben öffentliche Verträge und verweisen für Veröffentlichungsmetadaten auf Manifeste. Veröffentlichte Flow-Stage-IDs bleiben erhalten. `mountWhenDirect(mount)` liefert das Navigations-AbortSignal des Hosts; es wird nach asynchroner Initialisierung vor der Erstellung von UI-Ressourcen geprüft.
