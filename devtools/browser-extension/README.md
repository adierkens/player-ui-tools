# @player-tools/devtools-browser-extension

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

The Player UI Devtools Browser Extension is a powerful tool designed to aid in the development and debugging of experiences built with Player UI. It is available for Chrome and Firefox.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [Extending the Devtools](#extending-the-devtools)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## Overview

> What if the player devtools could be extended to support custom panels?

That's exactly what the Player UI Devtools Browser Extension does. It allows you to create custom devtools panels that can be used to debug and inspect your Player UI experiences, using the same [plugin system](https://player-ui.github.io/latest/plugins) used by other Player UI plugins.

We expose a set of default plugins, with basic functionality as Flow inspection, console, and events. However, we want the same level of extensibility that we have in the Player UI. So, the extension is a React Player, leveraging devtools-ui assets, that receives its content from the devtools plugins running into the Player UI in use by the inspected page.

That allow extending the devtools with custom panels, without the need to create a new extension. You can create your own devtools plugins and use them in the Player UI Devtools Browser Extension.

## Installation

The extension is available for Chrome and Firefox. Links to the extension in the Chrome and Firefox stores will be provided soon.

## Usage

To use the extension, you need to have the Player UI Devtools running in the inspected page leveraging one or more devtools plugins and have the extension installed. For more information on how to install and use the Player UI Devtools, check out the [Player UI Devtools documentation](https://player-ui.github.io/latest/devtools).

## Extending the Devtools

The Player UI Devtools Browser Extension is designed to be extended. You can add your own panels to the devtools through Player UI's [plugin system](https://player-ui.github.io/latest/plugins). For more information on how to create a Player UI dev tools plugin, check out the Player UI Devtools Plugin Template (link coming soon).

## Architecture

The devtools browser extension is composed by a [ReactPlayer](https://player-ui.github.io/latest/getting-started#react) that receives its content from the devtools plugins running into the Player UI leverage by the inspected page. The Player devtool plugins leverage the same [plugin system](https://player-ui.github.io/latest/plugins) used by others Player UI plugins.

## Contributing

We welcome contributions to the Player UI Devtools Browser Extension. If you're interested in contributing, please check out the [contributing guide](TODO).

## License

The Player UI Devtools Browser Extension is licensed under the [MIT license](TODO).
