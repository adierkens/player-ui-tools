import { produce } from 'immer';
import { dset } from 'dset/merge';
import type {
  DevtoolsDataChangeEvent,
  DevtoolsPluginsStore,
  ExtensionSupportedEvents,
  PlayerInitEvent,
  RuntimeEvent,
} from '@player-tools/devtools-types';

/** devtools plugin state reducer */
export const reducer = (
  state: DevtoolsPluginsStore,
  event: ExtensionSupportedEvents | RuntimeEvent
): DevtoolsPluginsStore => {
  switch (event.type) {
    case 'devtools-player-init':
      return produce(state, (draft) => {
        const {
          payload: { plugins, playerID },
        } = event;
        dset(draft.plugins, playerID, plugins);

        const message: PlayerInitEvent = {
          type: 'PLAYER_DEVTOOLS_PLAYER_INIT',
          payload: {
            plugins,
            playerID,
          },
        };

        draft.messages.push(message);
      });
    case 'devtools-player-data-changed':
      return produce(state, (draft) => {
        dset(
          draft.plugins,
          [event.payload.pluginID, 'flow', 'data', event.payload.bindings],
          event.payload.newValue
        );

        const message: DevtoolsDataChangeEvent = {
          type: 'PLAYER_DEVTOOLS_PLUGIN_DATA_CHANGE',
          payload: {
            pluginID: event.payload.pluginID,
            data: { [event.payload.bindings]: event.payload.newValue },
          },
        };

        draft.messages.push(message);
      });
    default:
      return state;
  }
};
