# WhatsApp Web Client

Ein WhatsApp Web Client, der mit [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) erstellt wurde und auf GitHub Pages gehostet werden kann.

## 📋 Überblick

Dieses Projekt besteht aus zwei Teilen:

1. **Frontend (GitHub Pages)**: Eine moderne Web-Oberfläche, die auf GitHub Pages gehostet werden kann
2. **Backend (Node.js Server)**: Ein Node.js-Server, der die whatsapp-web.js Bibliothek verwendet

## 🚀 Features

- ✅ QR-Code-Authentifizierung
- ✅ Nachrichten senden
- ✅ Chat-Liste anzeigen
- ✅ Eingehende Nachrichten in Echtzeit empfangen
- ✅ Moderne, responsive Benutzeroberfläche
- ✅ Einfache Konfiguration

## 📦 Installation

### Voraussetzungen

- Node.js (Version 14 oder höher)
- npm oder yarn
- Ein WhatsApp-Konto

### Backend-Server installieren

1. Repository klonen:
```bash
git clone https://github.com/ochtii/whatsapp_v1.git
cd whatsapp_v1
```

2. Abhängigkeiten installieren:
```bash
npm install
```

## 🎯 Verwendung

### Backend-Server starten

1. Server starten:
```bash
npm start
```

2. Der Server läuft standardmäßig auf `http://localhost:3000`

3. Beim ersten Start wird ein QR-Code in der Konsole und im Web-Interface angezeigt

4. Scannen Sie den QR-Code mit WhatsApp auf Ihrem Telefon:
   - Öffnen Sie WhatsApp
   - Gehen Sie zu Einstellungen → Verknüpfte Geräte
   - Tippen Sie auf "Gerät verknüpfen"
   - Scannen Sie den QR-Code

### Frontend verwenden

#### Option 1: Lokal testen

Öffnen Sie `public/index.html` direkt im Browser oder starten Sie den Backend-Server und navigieren Sie zu `http://localhost:3000`

#### Option 2: Auf GitHub Pages deployen

1. Pushen Sie den Code zu GitHub
2. Gehen Sie zu den Repository-Einstellungen
3. Navigieren Sie zu "Pages"
4. Wählen Sie den Branch und Ordner `/public` als Quelle
5. Speichern Sie die Einstellungen
6. Ihre Seite wird unter `https://[username].github.io/[repository-name]` verfügbar sein

**Wichtig**: Das Frontend auf GitHub Pages benötigt einen laufenden Backend-Server. Konfigurieren Sie die Server-URL im Interface entsprechend.

## 🔧 Konfiguration

### Backend-Server

Umgebungsvariablen können verwendet werden:

```bash
PORT=3000 npm start
```

**Für Produktionsumgebungen** sollten Sie CORS einschränken. Bearbeiten Sie `server.js`:

```javascript
const io = socketIO(server, {
  cors: {
    origin: "https://ihr-username.github.io", // Ihre GitHub Pages URL
    methods: ["GET", "POST"]
  }
});
```

### Frontend

Die Server-URL kann direkt im Web-Interface konfiguriert werden. Standard ist `http://localhost:3000`.

Für den Einsatz mit einem Remote-Server ändern Sie die URL zu Ihrer Server-Adresse:
```
https://ihre-server-url.com
```

## 🛠️ Technologien

### Backend
- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) - WhatsApp Web API
- [Express](https://expressjs.com/) - Web-Framework
- [Socket.IO](https://socket.io/) - Echtzeit-Kommunikation
- [QRCode](https://github.com/soldair/node-qrcode) - QR-Code-Generierung

### Frontend
- Vanilla JavaScript
- HTML5 & CSS3
- Socket.IO Client
- Responsive Design

## 📝 API-Endpunkte (Socket.IO Events)

### Client → Server

- `sendMessage` - Nachricht senden
  ```javascript
  { number: "491234567890", message: "Hallo!" }
  ```

- `getChats` - Chat-Liste abrufen

### Server → Client

- `qr` - QR-Code-Daten
- `ready` - Client ist bereit
- `authenticated` - Authentifizierung erfolgreich
- `auth_failure` - Authentifizierung fehlgeschlagen
- `message` - Neue Nachricht empfangen
- `chats` - Chat-Liste
- `messageSent` - Nachricht wurde gesendet
- `error` - Fehler aufgetreten

## 🔒 Sicherheitshinweise

- ⚠️ **Niemals** Ihre WhatsApp-Session-Daten (`.wwebjs_auth/`) teilen oder veröffentlichen
- ⚠️ Der Backend-Server sollte mit HTTPS in Produktion betrieben werden
- ⚠️ Implementieren Sie Authentifizierung für den Backend-Server in Produktionsumgebungen
- ⚠️ Verwenden Sie Umgebungsvariablen für sensible Konfigurationen

## 🚧 Einschränkungen

- Der Backend-Server muss separat gehostet werden (z.B. auf Heroku, DigitalOcean, AWS)
- GitHub Pages kann nur das Frontend hosten
- WhatsApp kann die Verbindung nach einiger Zeit trennen - dann muss der QR-Code neu gescannt werden
- Beachten Sie die WhatsApp-Nutzungsbedingungen

## 📚 Weiterführende Ressourcen

- [whatsapp-web.js Dokumentation](https://docs.wwebjs.dev/)
- [Socket.IO Dokumentation](https://socket.io/docs/)
- [GitHub Pages Dokumentation](https://docs.github.com/en/pages)

## 🤝 Beitragen

Beiträge sind willkommen! Erstellen Sie gerne einen Pull Request oder öffnen Sie ein Issue.

## 📄 Lizenz

MIT License - siehe LICENSE Datei für Details

## ⚠️ Haftungsausschluss

Dieses Projekt ist nicht mit WhatsApp oder Meta Platforms, Inc. verbunden. Die Verwendung erfolgt auf eigene Verantwortung. Stellen Sie sicher, dass Sie die WhatsApp-Nutzungsbedingungen einhalten.