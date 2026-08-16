# Provider OAuth Findings

Stand: 2026-08-16

## Salesforce
Die offizielle OAuth-Seite konnte über die stateless Extraktion nicht zuverlässig gelesen werden. Vor Implementierung muss der konkrete Salesforce-Authorization-Code-Flow und die benötigten API-Scopes aus der offiziellen Salesforce-Developer-Dokumentation verifiziert werden.

## Pipedrive
Pipedrive dokumentiert OAuth 2.0 über `https://oauth.pipedrive.com/oauth/authorize` und `https://oauth.pipedrive.com/oauth/token`. Der Authorization-Code-Flow benötigt `client_id`, `redirect_uri` und `state`; der Token-Austausch nutzt Basic Auth mit `client_id:client_secret` und liefert Access- sowie Refresh-Token. Access Tokens laufen ab und müssen über den Refresh Token erneuert werden. Quelle: https://developers.pipedrive.com/docs/api/v1/Oauth

## HubSpot
HubSpot nutzt OAuth 2.0 Authorization Code. Die Autorisierung erfolgt über `https://app.hubspot.com/oauth/authorize`, der Token-Austausch über `https://api.hubapi.com/oauth/v1/token`. Benötigt werden `client_id`, `scope`, `redirect_uri`, `state` und beim Token-Austausch zusätzlich `client_secret`; Access Tokens laufen ab und werden mit Refresh Tokens erneuert. Die Installation kann Super-Admin-Rechte im HubSpot-Portal erfordern. Quelle: https://developers.hubspot.com/docs/api/oauth-quickstart-guide

## Google Ads
Google Ads nutzt OAuth 2.0 und zusätzlich einen Google-Ads-Developer-Token für API-Aufrufe. Für Multi-User-Verbindungen soll der Authorization-Code-/Multi-User-Flow verwendet werden. Quelle: https://developers.google.com/google-ads/api/docs/oauth/overview

## Meta
Meta dokumentiert OAuth-/Access-Token-Autorisierung für die Marketing API. Der Marketing-API-Access-Token muss sicher serverseitig gespeichert werden; die konkrete App-Konfiguration, Berechtigungen und ggf. App-Review müssen vor Live-Betrieb festgelegt werden. Quellen: https://developers.facebook.com/documentation/ads-commerce/marketing-api/get-started/authorization und https://developers.facebook.com/documentation/ads-commerce/marketing-api/get-started/authentication

## LinkedIn
LinkedIn verwendet OAuth 2.0 für Member Authorization. Die Marketing-API-Programmberechtigungen sind laut offizieller FAQ 3-legged OAuth; 2-legged OAuth ist für diese Berechtigungen nicht verfügbar. Die tatsächlichen Marketing-/Conversions-Scopes und der App-Zugriff müssen im LinkedIn Developer Portal freigeschaltet werden. Quellen: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication, https://learn.microsoft.com/en-us/linkedin/marketing/lms-faq?view

## Konsequenz für die Implementierung
Die Backend-Architektur muss providerunabhängige OAuth-Start- und Callback-Routen, CSRF-sichere State-Werte, verschlüsselte Token-Speicherung, Refresh-Token-Unterstützung, Disconnect und Statusprüfung enthalten. Lovable wird vorerst nicht integriert. Provider-Client-IDs, Client-Secrets, Redirect-URIs, Google-Developer-Token und die jeweiligen App-Reviews/Scopes müssen vor produktiven Verbindungen eingerichtet werden.
