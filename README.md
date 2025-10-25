# RoomDraft — Offline Floor Plan & LiDAR Measure

> Production-ready **React Native** app for iOS that enables floor plan creation using **AR/LiDAR** or manual drawing, with fully **offline-first** architecture.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.75-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

### 🎯 Core Capabilities
- **AR/LiDAR Capture**: Use iPhone's ARKit and LiDAR sensors to scan rooms
- **Manual Drawing**: Create floor plans manually with precision tools
- **2D Editor**: Full-featured editor with snapping, measurements, and object placement
- **Export Options**: PDF, SVG, PNG (DXF with Pro)
- **Offline-First**: All data stored locally; works without internet
- **Physics-based Animations**: Smooth, native-feeling interactions with Reanimated 3
- **Skia Rendering**: High-performance custom graphics rendering

### 🎨 Design System
- Accessible color palette with light/dark mode
- SF Pro typography with dynamic type scaling
- 8pt spacing grid
- Gesture-first navigation
- Micro-interactions and spring animations

### 📦 Tech Stack
- **Framework**: React Native 0.75+ with New Architecture (Fabric/TurboModules)
- **Language**: TypeScript
- **Navigation**: React Navigation (native-stack)
- **Animation**: Reanimated 3 + Gesture Handler
- **Graphics**: @shopify/react-native-skia
- **Database**: SQLite with Drizzle ORM (@op-engineering/op-sqlite)
- **State**: Zustand
- **IAP**: react-native-iap

## Project Structure

```
RoomDraft/
├── src/
│   ├── animations/          # Reanimated worklets & motion configs
│   │   ├── motionConfig.ts
│   │   └── useAnimatedPress.ts
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── AnimatedIcon.tsx
│   │   └── ProgressBar.tsx
│   ├── database/            # SQLite schema & client
│   │   ├── schema.ts
│   │   ├── client.ts
│   │   └── init.ts
│   ├── design/              # Design system tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   ├── navigation/          # Navigation structure
│   │   └── AppNavigator.tsx
│   ├── screens/             # App screens
│   │   ├── SplashScreen.tsx
│   │   ├── ProjectsListScreen.tsx
│   │   ├── ProjectDetailScreen.tsx
│   │   ├── ARCaptureScreen.tsx
│   │   ├── EditorScreen.tsx
│   │   ├── ExportScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── stores/              # Zustand state stores
│   │   ├── themeStore.ts
│   │   ├── projectsStore.ts
│   │   ├── editorStore.ts
│   │   ├── captureStore.ts
│   │   └── iapStore.ts
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   └── utils/               # Helper functions
│       ├── geometry.ts
│       └── formatters.ts
├── App.tsx                  # Root component
├── index.js                 # Entry point
└── package.json
```

## Installation

### Prerequisites
- Node.js >= 18
- Xcode 14+ (for iOS)
- CocoaPods
- Yarn or npm

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/RoomDraft.git
cd RoomDraft

# Install dependencies
yarn install

# iOS: Install pods
cd ios && pod install && cd ..

# Run on iOS
yarn ios

# Run on Android (limited AR features)
yarn android
```

## Development

### Running the App

```bash
# Start Metro bundler
yarn start

# Run on iOS simulator
yarn ios

# Run on physical device (required for AR/LiDAR)
yarn ios --device

# Type checking
yarn typecheck

# Linting
yarn lint
```

### Database Migrations

The app uses SQLite with Drizzle ORM. Database initialization happens automatically on first launch.

```typescript
// Initialize database
import {initializeDatabase} from '@database/init';
await initializeDatabase();
```

### Adding Components

All components follow this pattern:

```typescript
import React from 'react';
import Animated, {useSharedValue, useAnimatedStyle, withSpring} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

export const MyComponent: React.FC<Props> = ({...}) => {
  const scale = useSharedValue(1);

  const gesture = Gesture.Tap()
    .onBegin(() => {
      'worklet';
      scale.value = withSpring(0.95);
    })
    .onFinalize(() => {
      'worklet';
      scale.value = withSpring(1);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        {/* Component content */}
      </Animated.View>
    </GestureDetector>
  );
};
```

## Architecture

### Offline-First
All user data is stored locally in SQLite. The app functions entirely without network connectivity.

### State Management
Zustand stores manage application state:
- `themeStore`: Dark mode, font scaling
- `projectsStore`: Projects list and CRUD
- `editorStore`: Editor mode, selection, history, clipboard
- `captureStore`: AR/LiDAR capture state
- `iapStore`: In-app purchases

### Data Flow
1. User actions trigger store updates
2. Stores update local state
3. Database operations persist changes
4. UI re-renders with updated state

### Performance
- Skia for high-performance graphics rendering
- Reanimated worklets run on UI thread
- SQLite indices for fast queries
- Differential rendering in editor

## IAP & Monetization

### Pro Features
- Unlimited plans (free: 3 plans)
- DXF export
- Furniture library access
- Advanced measurement tools

Implementation uses `react-native-iap`:

```typescript
// Check Pro status
const {isProActive} = useIAPStore();

// Trigger purchase
const handlePurchase = async () => {
  await purchaseProduct('pro_unlock');
};
```

## Testing

```bash
# Run tests
yarn test

# Run with coverage
yarn test --coverage
```

## Building for Production

### iOS

```bash
# Clean build
cd ios && xcodebuild clean && cd ..

# Build release
cd ios
xcodebuild -workspace RoomDraft.xcworkspace \
  -scheme RoomDraft \
  -configuration Release \
  -archivePath build/RoomDraft.xcarchive \
  archive

# Export IPA
xcodebuild -exportArchive \
  -archivePath build/RoomDraft.xcarchive \
  -exportPath build \
  -exportOptionsPlist ExportOptions.plist
```

### Android

```bash
cd android && ./gradlew assembleRelease
```

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please read CONTRIBUTING.md for guidelines.

## Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/RoomDraft/issues
- Documentation: https://docs.roomdraft.app

## Acknowledgments

Built with:
- React Native by Meta
- Reanimated by Software Mansion
- Skia by Shopify
- Drizzle ORM
- And many other open-source libraries

---

**Made with ❤️ for offline-first floor planning**
