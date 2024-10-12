# Partner Integration Documentation

## Overview
This document outlines the integration of a partner application into the Wootz browser using a Chrome extension with a React frontend. The extension uses the `chrome.wootz` API to access browser internals and can be accessed via the browser’s menu. It is fully mobile-compatible.

## Extension Development

### React Application
- A responsive React app serves as the UI and is loaded via `popup.html`.
- The app is accessed through the browser’s menu and is mobile-friendly.

### Chrome Extension Manifest
- The `public/manifest.json` file configures permissions, icons, and the popup interface.
- The extension requests the `chrome.wootz` permission to access internal browser data.

### `chrome.wootz` API
- The `chrome.wootz.info()` method fetches device and browser data.
- For local development, `chrome.wootz.info()` is mocked to return a test JSON object.

## Browser Menu Integration
- The extension adds an icon (`public/icons/icon128.png`) to the browser menu.
- The extension’s interface can be launched from the browser’s menu.

### File Structure

#### Public Files
- `public/icons/icon128.png`: The extension’s icon.
- `public/manifest.json`: Configures the extension.
- `public/popup.html`: Loads the React application.

#### React Components
- `src/components/LoginPage.js`: The login page UI.
- `src/components/BrowserBridge.js`: Facilitates communication with the `chrome.wootz` API.
- `src/components/RewardsPage.js`: Displays the rewards interface.
- `src/components/ProfilePage.js`: Displays the user profile page.

### API Testing and Mocking
To mock the `chrome.wootz.info()` method for testing:

```javascript
if (typeof chrome === 'undefined' || !chrome.wootz) {
  global.chrome = {
    wootz: {
      info: async () => '{"mock":"device", "info":"wootz"}'
    }
  };
}
```

## Production Setup
When installed in the Wootz browser, the extension uses the real `chrome.wootz.info()` to retrieve actual device and browser information.

This setup enables seamless integration of the partner extension into the Wootz browser, using React for the frontend and leveraging Chrome extension capabilities for cross-platform compatibility.
