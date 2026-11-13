# Tank Levels

Phone and desktop app that shows live tank levels: litres, % full and level for each tank, plus total stock.

**Open the app:** https://m9r1u5.github.io/Tank/

## Install
- **Android:** open the link in Chrome, then use the menu (&#8942;) > **Install app**, or download `TankLevels.apk` from the latest [release](../../releases).
- **iPhone / iPad:** open the link in Safari, tap **Share** > **Add to Home Screen**.
- **PC:** open the link in Edge or Chrome and click the install icon in the address bar.

## How it works
The plant PC reads the PLC (read-only) and publishes the readings. This app only displays them.
Until a data source is set, the app shows sample readings and a **Demo** badge.

## Admin
Menu > **Admin**. The first time, you create an admin password (stored only as a hash on that device).
Admin shows the 4-20 mA sensor signals for fault finding, the tank-to-PLC channel list,
unidentified channels, and the data source address.

## Files
- `index.html` - the app
- `manifest.webmanifest`, `sw.js`, `*.png` - install and offline support
- `.github/workflows/build-apk.yml` - builds the Android APK on every push to `main`
