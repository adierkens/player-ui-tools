import type { ExtensionState } from '@player-tools/devtools-types';
import type { Flow, ReactPlayerOptions } from '@player-ui/react';
import { ReferenceAssetsPlugin } from '@player-ui/reference-assets-plugin-react';

export const PLAYER_CONFIG: ReactPlayerOptions = {
  // TODO: swap for the devtools UI assets when they are ready:
  plugins: [
    new ReferenceAssetsPlugin(),
    // TODO: fix this type - player and react player are not compatible:
  ] as unknown as ReactPlayerOptions['plugins'],
};

export const INITIAL_FLOW: Flow = {
  id: 'initial-flow',
  views: [
    {
      id: 'view-1',
      type: 'text',
      value: 'connecting...',
    },
  ],
  navigation: {
    BEGIN: 'FLOW_1',
    FLOW_1: {
      startState: 'VIEW_1',
      VIEW_1: {
        state_type: 'VIEW',
        ref: 'view-1',
        transitions: {},
      },
    },
  },
};

export const INITIAL_EXTENSION_STATE: ExtensionState = {
  current: {
    player: null,
    plugin: null,
  },
  players: {},
};
