# MultiTV Podcasts

A cross-platform TV podcast player built with React Native, supporting Fire TV, Android TV, Apple TV, and the web.

![Screenshots](./images/screenshots.png)


https://github.com/user-attachments/assets/54e3b5af-c778-45c0-8ceb-223d5ed6cd1a


## Introduction

MultiTV Podcasts allows users to discover and listen to podcasts directly on TV devices through a remote-friendly interface. The app integrates with the Podcast API, enabling users to search for podcasts, browse podcast details, and select from multiple episodes for playback.

### Features

* 🔍 Search podcasts using the Podcast API
* 🎙 Browse podcast information and episode lists
* 📺 Select and play episodes from your favorite podcasts
* 🎯 TV-optimized navigation and focus management
* 🔄 Shared codebase across multiple TV platforms

### Supported Platforms

| Platform      | Target Devices       |
| ------------- | -------------------- |
| Vega (Kepler) | Fire TV              |
| Expo TV       | Android TV, Apple TV |
| Expo Web      | Browser              |

## Architecture

This project is built as a Yarn Workspaces monorepo to maximize code sharing across TV platforms. The repository includes:

* A shared package containing reusable components, screens, services, and utilities
* A Vega application targeting Fire TV devices
* An Expo TV application targeting Android TV and Apple TV
* Web support through Expo Web

The shared architecture allows most application logic, UI components, and API integrations to be written once and reused across all supported platforms.

## Project Structure

## Project Structure

```
├── package.json                 # Root workspace config (Yarn 4)
├── packages/
│   ├── shared/                  # @multitv/shared
│   │   ├── src/
│   │   │   ├── components/      # Header, HeaderLogo, Tile, ApiDemo, IconReactNativeAnimated
│   │   │   ├── screens/         # HomeScreen
│   │   │   ├── data/            # Tile definitions
│   │   │   ├── services/        # HTTP client (fetch-based)
│   │   │   ├── utils/           # Scaling utilities
│   │   │   └── assets/          # Platform logos, background images
│   │   └── index.ts             # Public API exports
│   ├── expotv/                  # @multitv/expotv
│   │   ├── app/                 # Expo Router pages
│   │   ├── components/          # TV-specific components
│   │   ├── layouts/             # Tab layouts (native + web)
│   │   ├── hooks/               # useScale, useColorScheme, useTextStyles
│   │   ├── constants/           # Colors, TextStyles
│   │   └── assets/              # Images, fonts, TV icons
│   └── vega/                    # @multitv/vega (symlink)
│       ├── src/
│       │   └── App.tsx
│       ├── test/
│       ├── manifest.toml
│       └── package.json
```

## Prerequisites

### Core Requirements

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Yarn](https://yarnpkg.com/) (v4.5.0 or higher)
- [Git](https://git-scm.com/)

### Platform-Specific Requirements

**Vega (Fire TV)**

Vega development requires the Vega SDK and Yarn configuration for Amazon device packages.

1. [Install the Vega Developer Tools](https://developer.amazon.com/docs/vega/latest/install-vega-sdk.html)
2. [Configure Yarn for Vega](https://developer.amazon.com/docs/vega/latest/configure-package-managers.html)

**Expo TV**

- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android Studio with an Android TV system image (for Android TV)
- Xcode (for Apple TV)

## Quick Start

```bash
# Install all workspace dependencies
yarn

# Build the Vega/Fire TV app (debug)
yarn vega:build

# Run on Vega Virtual Device (Mac M-series)
yarn vega:vvd:mseries

# Run on Vega Virtual Device (Intel Mac)
yarn vega:vvd:intel

# Run on a Fire TV Stick (pass DSN)
yarn vega:firetv <DSN>

# Prebuild Expo TV native projects
yarn expotv:prebuild

# Run on Android TV
yarn expotv:android

# Run on Apple TV
yarn expotv:ios

# Run on web
yarn expotv:web
```

## Build and Run

You can build and run using either the CLI or the [Vega Studio IDE extension](https://developer.amazon.com/docs/vega/0.22/setup-extension.html). We recommend the IDE, which provides build, run, and device management directly from the sidebar panel. Vega Studio also has [monorepo support](https://developer.amazon.com/docs/vega/0.22/monorepo-support.html) that automatically detects the workspace layout and imports Vega sub-packages when you open the project.

### Vega (Fire TV) CLI

Build the project:

```bash
# Debug build (recommended for development, enables Fast Refresh)
yarn workspace @multitv/vega run build:debug

# Release build
yarn workspace @multitv/vega run build:release
```

Run on a Vega virtual device:

```bash
vega virtual-device start

# Mac M-series (aarch64) - using yarn script
yarn vega:vvd:mseries

# Intel Mac (x86_64) - using yarn script
yarn vega:vvd:intel

# Or directly with the Vega CLI
# Mac M-series (aarch64)
vega run-app packages/vega/build/aarch64-debug/vega_aarch64.vpkg com.amazondeveloper.hellosharedworkspace.main -d VirtualDevice

# Intel Mac (x86_64)
vega run-app packages/vega/build/x86_64-debug/vega_x86_64.vpkg com.amazondeveloper.hellosharedworkspace.main -d VirtualDevice
```

Run on a Fire TV Stick (replace `<DSN>` with your device serial number):

```bash
# Using the yarn script
yarn vega:firetv <DSN>

# Or directly
vega run-app packages/vega/build/armv7-release/vega_armv7.vpkg com.amazondeveloper.hellosharedworkspace.main -d <DSN>
```

The `vega run-app` command takes the form `vega run-app <Vpkg path> <App ID> -d <device>`. The App ID is the interactive component id from `manifest.toml` (here, `com.amazondeveloper.hellosharedworkspace.main`). Use `VirtualDevice` for the VVD or the device serial number (DSN) for a Fire TV Stick. See the [Vega CLI reference](https://developer.amazon.com/docs/vega/0.22/cli-tools.html) for details.

[Fast Refresh](https://reactnative.dev/docs/fast-refresh) is available in debug builds. See [Set Up Fast Refresh](https://developer.amazon.com/docs/vega/latest/fast-refresh.html) for configuration.

### Expo TV

> **Note:** Apple TV (iOS) must run on port 8081. Avoid running Vega and Expo TV builds at the same time, as they use separate Metro instances that can conflict.

Prebuild the native projects first:

```bash
yarn expotv:prebuild
```

Then run on your target platform:

```bash
# Android TV
yarn expotv:android

# Apple TV
yarn expotv:ios

# Web
yarn expotv:web
```

## Tech Stack

|              | Expo TV                       | Vega (Fire TV)                                      |
| ------------ | ----------------------------- | --------------------------------------------------- |
| Framework    | Expo SDK 54                   | Kepler (@amazon-devices/react-native-kepler ^2.0.0) |
| React        | 19.1.0                        | 18.2.0                                              |
| React Native | react-native-tvos 0.81-stable | 0.72.0                                              |
| TypeScript   | ~5.9.2                        | 4.8.4                                               |

The shared package (`@multitv/shared`) provides:

- UI components: Header, HeaderLogo (with platform-specific variants), Tile, ApiDemo, IconReactNativeAnimated
- HomeScreen with tile-based navigation and focus management
- Scaling utilities for TV display dimensions (1920x1080 base). The scaling approach used here is simple and works for a demo, but for production apps you may want a more robust solution like responsive layouts or a design system.
- A fetch-based HTTP client

### Platform-Specific File Extensions

The shared package uses React Native's platform resolution to load the right assets per platform:

- `.kepler.tsx` for Vega/Fire TV
- `.android.tsx` for Android TV
- `.ios.tsx` for Apple TV
- `.web.tsx` for web

## Notes

The Expo TV app (`packages/expotv/`) was scaffolded from the default Expo TV template. Some boilerplate files from the template (e.g. `HelloWave`, `ParallaxScrollView`, `ExternalLink`) are still present and not used by the shared components. They're harmless but can be removed if you want a cleaner setup.

## Troubleshooting

### Metro Dependency Resolution

If Metro fails to resolve dependencies, check that `watchFolders` and `nodeModulesPaths` are correctly configured in the Metro config. The monorepo uses `react-native-monorepo-tools` to handle this.

### Vega Build Issues

Make sure the Vega CLI tools are installed and configured correctly.
See [Vega CLI Installation](https://developer.amazon.com/docs/vega/latest/install-vega-sdk.html).

### Fast Refresh Not Working

Fast Refresh only works with debug builds:

- `vega_aarch64.vpkg` from `aarch64-debug/` for M-series Mac
- `vega_x86_64.vpkg` from `x86_64-debug/` for Intel Mac
- `vega_armv7.vpkg` from `armv7-debug/` for Fire TV Stick

### Android NDK Error

If you see `[CXX1101] NDK did not have a source.properties file`, remove any empty NDK installation directories from your Android SDK.

## Related Resources

- [React Native Documentation](https://reactnative.dev/)
- [React Native TvOS](https://github.com/react-native-tvos/react-native-tvos)
- [Vega Developer Portal](https://developer.amazon.com/docs/vega/vega.html)
- [Expo Documentation](https://docs.expo.dev/)
- [Yarn Workspaces](https://yarnpkg.com/features/workspaces)

## License

See [LICENSE](LICENSE) file.
