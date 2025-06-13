# My Secretary Agent

A mobile app built with Expo and React Native for scanning food product barcodes, retrieving ingredient data, and managing your food inventory. The app uses Convex as a backend for storing and querying food and ingredient data.

## Features

- Scan food product barcodes (EAN-13, UPC-A, UPC-E, EAN-8)
- Fetch ingredient details by barcode
- Add new ingredients to your inventory
- Themed UI with custom ThemedButton and ThemedText components
- File-based routing for easy navigation

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (or npm/yarn)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

1. Install dependencies:

   ```bash
   pnpm install
   # or
   npm install
   ```

2. Start the development server:

   ```bash
   pnpm start
   # or
   npx expo start
   ```

3. Open the app:
   - Use the QR code in your terminal to open in Expo Go on your device
   - Or run in an Android/iOS simulator

## Project Structure

- `app/` - Main app source code (screens, API routes)
- `components/` - Reusable UI components (ThemedButton, ThemedText, etc.)
- `convex/` - Convex backend functions and schema
- `hooks/` - Custom React hooks
- `utils/` - Utility functions and schemas

## Development

- Edit screens in `app/(tabs)/`
- Add new components in `components/`
- Update backend logic in `convex/`

### Resetting the Project

To reset the app to a blank state:

```bash
pnpm run reset-project
```

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Convex Documentation](https://docs.convex.dev/)
- [React Native](https://reactnative.dev/)

## License

MIT
