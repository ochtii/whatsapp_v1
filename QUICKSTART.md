# Quick Start Guide / Schnellstart-Anleitung

## 🚀 In 5 Minuten starten

### Schritt 1: Backend Server lokal starten

```bash
# Repository klonen
git clone https://github.com/ochtii/whatsapp_v1.git
cd whatsapp_v1

# Abhängigkeiten installieren
npm install

# Server starten
npm start
```

Der Server läuft nun auf `http://localhost:3000`

### Schritt 2: Frontend öffnen

**Option A - Lokal testen:**
Öffnen Sie `http://localhost:3000` im Browser

**Option B - GitHub Pages (nach Deployment):**
Öffnen Sie `https://[IHR-USERNAME].github.io/whatsapp_v1/`

### Schritt 3: WhatsApp verbinden

1. Im Browser erscheint ein QR-Code
2. Öffnen Sie WhatsApp auf Ihrem Smartphone
3. Gehen Sie zu: **Einstellungen** → **Verknüpfte Geräte** → **Gerät verknüpfen**
4. Scannen Sie den QR-Code mit Ihrem Telefon

✅ Fertig! Sie sind jetzt verbunden und können Nachrichten senden.

---

## 📱 Nachrichten senden

1. Warten Sie, bis der Status "WhatsApp Client bereit!" anzeigt
2. Geben Sie die Telefonnummer ein (mit Ländercode, ohne +)
   - Beispiel: `491234567890` für Deutschland
   - Beispiel: `4179123456` für Schweiz
   - Beispiel: `436641234567` für Österreich
3. Schreiben Sie Ihre Nachricht
4. Klicken Sie auf "Senden"

---

## 🔧 Problemlösung

### QR-Code wird nicht angezeigt
- Stellen Sie sicher, dass der Backend-Server läuft
- Überprüfen Sie die Browser-Konsole (F12) auf Fehler
- Versuchen Sie die Seite neu zu laden

### "Verbindungsfehler" Meldung
- Prüfen Sie, ob der Server unter `http://localhost:3000` erreichbar ist
- Bei Remote-Server: Geben Sie die korrekte URL im "Server-Konfiguration" Bereich ein
- Firewall-Einstellungen prüfen

### Nachricht kann nicht gesendet werden
- Stellen Sie sicher, dass Sie verbunden sind (grüner Status-Punkt)
- Telefonnummer ohne +, Leerzeichen oder Bindestriche eingeben
- Format: Ländercode + Nummer (z.B. 491234567890)

---

## 🌐 GitHub Pages Deployment

### Automatisch (empfohlen):

1. Code pushen:
```bash
git push origin main
```

2. GitHub Actions deployt automatisch zu Pages
3. URL: `https://[USERNAME].github.io/whatsapp_v1/`

### Wichtig:
⚠️ Das Frontend auf GitHub Pages benötigt einen separaten Backend-Server!

**Backend-Hosting-Optionen:**
- **Lokal**: Für Tests (`npm start`)
- **Heroku**: Kostenlos möglich
- **Railway.app**: Einfaches Deployment
- **Render.com**: Kostenloser Tier verfügbar
- **Eigener Server**: VPS/DigitalOcean

Siehe `DEPLOYMENT.md` für detaillierte Anweisungen.

---

## 📚 Weitere Informationen

- **README.md** - Vollständige Dokumentation
- **DEPLOYMENT.md** - Deployment-Anleitung für verschiedene Plattformen
- **package.json** - Node.js Abhängigkeiten
- **public/** - Frontend-Dateien (HTML/CSS/JS)
- **server.js** - Backend-Server Code

---

## ⚡ Tipps

1. **Session bleibt erhalten**: Die WhatsApp-Session wird in `.wwebjs_auth/` gespeichert. Sie müssen den QR-Code nur einmal scannen.

2. **Mehrere Geräte**: WhatsApp erlaubt bis zu 4 verknüpfte Geräte.

3. **Sicherheit**: Teilen Sie niemals den `.wwebjs_auth/` Ordner - er enthält Ihre Login-Daten!

4. **Updates**: Halten Sie die Dependencies aktuell:
   ```bash
   npm update
   ```

5. **Debug-Modus**: Server-Logs zeigen alle Ereignisse:
   ```bash
   npm start
   # Logs werden in der Konsole angezeigt
   ```

---

## 🆘 Support

Bei Problemen:
1. Prüfen Sie die [whatsapp-web.js Issues](https://github.com/pedroslopez/whatsapp-web.js/issues)
2. Lesen Sie die [Dokumentation](https://docs.wwebjs.dev/)
3. Erstellen Sie ein Issue in diesem Repository

---

**Viel Erfolg! 🎉**
