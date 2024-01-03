import React, { useEffect } from 'react';
import type { ReactPlayer, ReactPlayerPlugin } from '@player-ui/react';
import type { Flow } from '@player-ui/types';
import type {
  PluginData,
  PlayerDataChanged,
  PlayerInit,
} from '@player-tools/devtools-types';
import { usePluginState } from '../common/state/usePluginState';

let count = 0;

const pluginUI: Flow = {
  id: 'initial-flow',
  views: [
    {
      id: 'view-1',
      type: 'text',
      value: 'PLUGIN 1 - count: {{content}}',
    },
  ],
  data: {
    content: 0,
  },
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

const pluginData: PluginData = {
  id: 'test-plugin-1',
  name: 'Test Plugin 1',
  description: 'Test Plugin 1',
  version: '0.0.1',
  flow: pluginUI,
};

export const WrapperComponent = ({
  children,
}: {
  /** component's children */
  children: React.ReactNode;
}) => {
  const [, id, dispatch] = usePluginState();

  useEffect(() => {
    const timeout = setInterval(() => {
      const event: PlayerDataChanged = {
        type: 'devtools-player-data-changed',
        payload: {
          pluginID: pluginData.id,
          bindings: 'content',
          oldValue: count++,
          newValue: count,
        },
      };

      dispatch(event);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [dispatch, id]);

  useEffect(() => {
    const event: PlayerInit = {
      type: 'devtools-player-init',
      payload: {
        playerID: id,
        plugins: {
          [pluginData.id]: pluginData,
        },
      },
    };

    dispatch(event);
  }, [dispatch, id]);

  return children as JSX.Element;
};

export class Plugin1 implements ReactPlayerPlugin {
  name = 'devtools';

  applyReact(reactPlayer: ReactPlayer) {
    reactPlayer.hooks.webComponent.tap(this.name, (Comp) => () => {
      return (
        <WrapperComponent>
          <Comp />
        </WrapperComponent>
      );
    });
  }
}
