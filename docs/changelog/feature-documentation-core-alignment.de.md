# Dokumentation und Hostverträge

**Feature-Zweig:** feature-documentation-core-alignment

## Strukturierte Dokumentation

Info, Anwendung und Technik bilden vollständige lokalisierte Dokumentfamilien im Modulmanifest. Einführung, praktische Abläufe und aktuelle API-/Konfigurationsverträge besitzen eigene Ansichten. Strikte Gliederungs-, Verweis- und Dateinamenprüfungen laufen in eigenständigen Tests und CI. Quelldateilinks folgen dem Standardzweig; Änderungslinks behalten kurze Commitbezeichnungen.

## Gatewaydiagnosen

Laufzeitdiagnosen verwenden das Logging-Gateway des Hosts und dessen Ausgaberichtlinie. Befehlsberichte nutzen Terminalausgaben. Die Prüfung nativer Konsole umfasst Modul-JavaScript einschließlich Aliasen und berechneter Zugriffe. Anbieterlebenszyklen, Berechtigungen und Anleitungsabschluss-IDs bleiben erhalten.

## Aussagekräftige Bindungsnamen

Die Syntaxbaumprüfung untersucht Deklarationen, Exporte, Destrukturierungen, Laufzeit- und Typsignaturparameter, Konstruktor-Parametereigenschaften, Catch-Bindungen, Importe, benannte Funktionen und Klassen, Laufzeitbindungen von Enums und Namensräumen sowie private Mitglieder unabhängig von der Formatierung. Sie erfasst Quelltext, Werkzeuge, Tests und Testdaten ohne Altbestands- oder Dateiausnahmen. Undurchsichtige Kurzformen, abgekürzte Pluralformen, nummerierte Platzhalter und verwendete ignorierte Bindungen lassen die Prüfung fehlschlagen. Übliche Entwicklerbegriffe wie `args`, `db`, LDAP-`dn`, HTTP-`req`/`res`, `env`, `opts` und `params` bleiben zulässig; das Glossar definiert den vollständigen Wortschatz. Weitere kurze Ausnahmen sind ein ungenutztes, nicht exportiertes `_`, `id` und numerische `i`/`j`/`k`-Zähler mit passenden arithmetischen Aktualisierungen. Koordinaten und Abmessungen erhalten aussagekräftige lokale Namen. Eigene Hilfs- und Speicher-APIs verwenden ihre aussagekräftigen Namen direkt in Deklarationen, Exporten, Importen und Aufrufern; reine Umbenennungsaliase für Importe und Exporte schlagen fehl. Verbraucher müssen die kanonischen Exporte statt verkürzter Aliase verwenden. Öffentliche Nutzdatenschlüssel, Fähigkeitsbezeichner und reine Typbezeichner behalten ihre Vertragsrollen. Lokalisierte Handbücher, Beitragsrichtlinien, Modulversionen, Sperrdateien und Paketprüfsummen sind synchronisiert.

## Änderungen

- [aebdd20](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/aebdd200a70db17c6e97b76cf88ef227f161b4a5)
- [d47b3a6](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/d47b3a6872389446b739af45345497a3cea2c7bb)
- [d7a59c8](https://github.com/Cognis-Labs-HQ/cognis-module-elevanlabs-tts/commit/d7a59c81a82ce26cc6086d7cb56b8bd2a74508c8)
