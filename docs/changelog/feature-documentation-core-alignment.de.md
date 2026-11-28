# Dokumentation und Hostverträge

**Feature-Zweig:** feature-documentation-core-alignment

## Strukturierte Dokumentation

Info, Anwendung und Technik bilden vollständige lokalisierte Dokumentfamilien im Modulmanifest. Einführung, praktische Abläufe und aktuelle API-/Konfigurationsverträge besitzen eigene Ansichten. Strikte Gliederungs-, Verweis- und Dateinamenprüfungen laufen in eigenständigen Tests und CI. Quelldateilinks folgen dem Standardzweig; Änderungslinks behalten kurze Commitbezeichnungen.

## Gatewaydiagnosen

Laufzeitdiagnosen verwenden das Logging-Gateway des Hosts und dessen Ausgaberichtlinie. Befehlsberichte nutzen Terminalausgaben. Die Prüfung nativer Konsole umfasst Modul-JavaScript einschließlich Aliasen und berechneter Zugriffe. Anbieterlebenszyklen, Berechtigungen und Anleitungsabschluss-IDs bleiben erhalten.

## Aussagekräftige Bindungsnamen

Die Syntaxbaumprüfung erfasst JavaScript- und TypeScript-Quelltext, Werkzeuge, Tests und Testdaten ohne Altbestands- oder Dateiausnahmen. Sie prüft Laufzeitbindungen, Signaturparameter, private Mitglieder sowie eigene zusammengesetzte Typ- und Methodennamen. Übliche Kurzformen bleiben als direkte Namen wie `db`, `this.db`, `args` und LDAP-`dn` zulässig. Zusammengesetzte Namen schreiben andere Kurzformen als Maßeinheiten aus, auch bei übernommenen Bezeichnern: `DatabaseExecutor`, `KeyringDatabaseExecutor`, `createDatabaseExecutor`, `baseDistinguishedName` und `registerStaticDirectory`. Undurchsichtige Kurzformen, nummerierte Platzhalter und verwendete ignorierte Bindungen lassen die Prüfung fehlschlagen. Ein ungenutztes, nicht exportiertes `_`, `id` und arithmetische `i`/`j`/`k`-Zähler behalten ihre festgelegten Rollen. Generische Typparameter, kanonische Abhängigkeits- und Plattformnamen sowie öffentliche Nutzdatenschlüssel behalten ihre Verträge. Eigene API-Deklarationen, Importe, Exporte und Aufrufer verwenden denselben Namen; reine Umbenennungsaliase einschließlich Typaliasen schlagen fehl. Regressionstestfälle sichern die Unterscheidung direkter und zusammengesetzter Namen sowie kanonische Plattform-APIs. Lokalisierte Handbücher, Beitragsrichtlinien, Modulversionen, Sperrdateien und Paketprüfsummen sind synchronisiert. Maßeinheiten wie `ms`, `sec`, `px`, `rad` und `deg` bleiben in zusammengesetzten Namen abgekürzt. Zeit- und Pixelangaben verwenden wieder Formen wie `INVITE_EXPIRY_MS`, `timeoutMs` und `widthPx`. Regressionstestfälle sichern die Einheitenausnahme, ohne undurchsichtige benachbarte Wörter zuzulassen.

## Änderungen

- [aebdd20](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/aebdd200a70db17c6e97b76cf88ef227f161b4a5)
- [d47b3a6](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/d47b3a6872389446b739af45345497a3cea2c7bb)
- [d7a59c8](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/d7a59c81a82ce26cc6086d7cb56b8bd2a74508c8)
- [0b26047](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/0b26047e65adeac6187baf24479af99916d0f3eb)
- [66fc627](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/66fc627907840eb9a79deb8bd6d74ed856bc5ed9)
