# Deployment Guide / Bereitstellungsanleitung

## GitHub Pages Deployment

### Automatisches Deployment

1. **Repository-Einstellungen konfigurieren**:
   - Gehen Sie zu Ihrem Repository auf GitHub
   - Klicken Sie auf "Settings" (Einstellungen)
   - Wählen Sie "Pages" im linken Menü
   - Unter "Build and deployment":
     - Source: "GitHub Actions"
   - Speichern

2. **Code pushen**:
   ```bash
   git add .
   git commit -m "Initial WhatsApp Web Client"
   git push origin main
   ```

3. **GitHub Actions Workflow**:
   - Der Workflow in `.github/workflows/pages.yml` wird automatisch ausgeführt
   - Überprüfen Sie den Fortschritt unter "Actions" in Ihrem Repository
   - Nach erfolgreicher Ausführung ist Ihre Seite verfügbar

4. **Zugriff auf Ihre Seite**:
   - Die URL wird sein: `https://[IHR-USERNAME].github.io/[REPOSITORY-NAME]/`
   - Sie finden die genaue URL auch in den Repository-Einstellungen unter "Pages"

### Manuelles Deployment

Wenn Sie GitHub Actions nicht verwenden möchten:

1. Gehen Sie zu "Settings" → "Pages"
2. Wählen Sie unter "Source": "Deploy from a branch"
3. Branch: `main` oder `master`
4. Folder: `/public`
5. Klicken Sie auf "Save"

## Backend-Server Deployment

Das Frontend auf GitHub Pages benötigt einen laufenden Backend-Server. Hier sind einige Optionen:

### Option 1: Lokaler Server

Für Tests und Entwicklung:

```bash
npm install
npm start
```

Server läuft auf `http://localhost:3000`

### Option 2: Heroku

1. **Heroku CLI installieren** und einloggen:
   ```bash
   heroku login
   ```

2. **App erstellen**:
   ```bash
   heroku create ihre-app-name
   ```

3. **Procfile erstellen** (im Hauptverzeichnis):
   ```
   web: node server.js
   ```

4. **Deployen**:
   ```bash
   git add .
   git commit -m "Prepare for Heroku"
   git push heroku main
   ```

5. **URL aktualisieren**:
   - Öffnen Sie Ihre GitHub Pages Seite
   - Geben Sie die Heroku URL ein: `https://ihre-app-name.herokuapp.com`

### Option 3: DigitalOcean / VPS

1. **Server einrichten**:
   ```bash
   # Auf Ihrem Server
   sudo apt update
   sudo apt install nodejs npm
   ```

2. **Code hochladen**:
   ```bash
   git clone https://github.com/IHR-USERNAME/REPOSITORY-NAME.git
   cd REPOSITORY-NAME
   npm install
   ```

3. **PM2 für Dauerbetrieb installieren**:
   ```bash
   sudo npm install -g pm2
   pm2 start server.js
   pm2 save
   pm2 startup
   ```

4. **Nginx als Reverse Proxy** (optional):
   ```nginx
   server {
       listen 80;
       server_name ihre-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **SSL mit Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d ihre-domain.com
   ```

### Option 4: Railway.app

1. **Account erstellen** auf [Railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub repo**
3. Repository auswählen
4. Railway erkennt automatisch Node.js
5. Environment Variables setzen (falls nötig)
6. Deploy!

### Option 5: Render.com

1. **Account erstellen** auf [Render.com](https://render.com)
2. **New** → **Web Service**
3. Repository verbinden
4. Konfiguration:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Create Web Service**

## Umgebungsvariablen

Für Produktionsumgebungen:

```bash
PORT=3000
NODE_ENV=production
```

## Sicherheit in Produktion

### Backend-Server absichern

1. **HTTPS verwenden**:
   - Immer SSL/TLS in Produktion verwenden
   - Let's Encrypt für kostenlose Zertifikate

2. **CORS konfigurieren**:
   ```javascript
   // In server.js
   const io = socketIO(server, {
     cors: {
       origin: "https://ihr-username.github.io",
       methods: ["GET", "POST"]
     }
   });
   ```

3. **Authentifizierung hinzufügen**:
   ```javascript
   // Beispiel: Einfache Token-Authentifizierung
   io.use((socket, next) => {
     const token = socket.handshake.auth.token;
     if (token === process.env.SECRET_TOKEN) {
       next();
     } else {
       next(new Error('Authentication failed'));
     }
   });
   ```

4. **Rate Limiting**:
   ```bash
   npm install express-rate-limit
   ```

   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100
   });
   
   app.use(limiter);
   ```

## Fehlerbehebung

### GitHub Pages lädt nicht

- Überprüfen Sie GitHub Actions Logs
- Stellen Sie sicher, dass Pages in den Settings aktiviert ist
- Warten Sie einige Minuten nach dem Deployment

### Backend-Server Verbindungsfehler

- Prüfen Sie, ob der Server läuft
- Überprüfen Sie die Server-URL im Frontend
- Stellen Sie sicher, dass CORS richtig konfiguriert ist
- Prüfen Sie Firewall-Einstellungen

### QR-Code wird nicht angezeigt

- Überprüfen Sie die Browser-Konsole auf Fehler
- Stellen Sie sicher, dass der Backend-Server läuft
- Löschen Sie `.wwebjs_auth/` und starten Sie neu

### WhatsApp-Session abgelaufen

- Scannen Sie den QR-Code erneut
- Die Session-Daten werden in `.wwebjs_auth/` gespeichert
- Stellen Sie sicher, dass dieser Ordner persistent ist (nicht bei jedem Deployment gelöscht wird)

## Best Practices

1. **Separate Umgebungen**: Entwicklung, Staging, Produktion
2. **Monitoring**: Verwenden Sie Tools wie PM2, New Relic oder Datadog
3. **Logging**: Implementieren Sie strukturiertes Logging
4. **Backups**: Sichern Sie `.wwebjs_auth/` Ordner regelmäßig
5. **Updates**: Halten Sie Abhängigkeiten aktuell

## Nächste Schritte

Nach dem Deployment:

1. ✅ Testen Sie die Verbindung zwischen Frontend und Backend
2. ✅ Scannen Sie den QR-Code
3. ✅ Senden Sie eine Test-Nachricht
4. ✅ Überprüfen Sie die Chat-Liste
5. ✅ Konfigurieren Sie Sicherheitsmaßnahmen für Produktion

## Support

Bei Problemen:
- Überprüfen Sie die [whatsapp-web.js Issues](https://github.com/pedroslopez/whatsapp-web.js/issues)
- Lesen Sie die [Dokumentation](https://docs.wwebjs.dev/)
- Erstellen Sie ein Issue in diesem Repository
