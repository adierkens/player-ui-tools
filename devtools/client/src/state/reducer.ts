import type {
  MessengerEvent,
  TransactionMetadata,
} from '@player-tools/devtools-messenger';
import type {
  ExtensionState,
  ExtensionSupportedEvents,
} from '@player-tools/devtools-types';
import { dset } from 'dset/merge';
import { produce } from 'immer';

/** Extension state reducer */
export const reducer = (
  state: ExtensionState,
  event: TransactionMetadata & MessengerEvent<ExtensionSupportedEvents>
): ExtensionState => {
  switch (event.type) {
    case 'PLAYER_DEVTOOLS_PLAYER_INIT':
      return produce(state, (draft) => {
        const {
          sender,
          payload: { plugins },
        } = event;
        const { player, plugin } = draft.current;

        if (!player && !plugin) {
          // if there is no player and plugin selected, select the first one:
          dset(draft, ['current', 'player'], sender);
          dset(
            draft,
            ['current', 'plugin'],
            plugins[Object.keys(plugins)[0]].id
          );
        }

        dset(draft, ['players', sender, 'plugins'], plugins);
        dset(draft, ['players', sender, 'active'], true);
      });
    case 'PLAYER_DEVTOOLS_PLUGIN_FLOW_CHANGE':
      return produce(state, (draft) => {
        const {
          sender,
          payload: { flow, pluginID },
        } = event;

        dset(draft, ['players', sender, 'plugins', pluginID, 'flow'], flow);
      });
    case 'PLAYER_DEVTOOLS_PLUGIN_DATA_CHANGE':
      return produce(state, (draft) => {
        const {
          sender,
          payload: { data, pluginID },
        } = event;
        dset(
          draft,
          ['players', sender, 'plugins', pluginID, 'flow', 'data'],
          data
        );
      });
    case 'MESSENGER_EVENT_BATCH':
      return produce(state, (draft) => {
        return event.payload.events.reduce(reducer, draft);
      });
    case 'PLAYER_DEVTOOLS_PLAYER_STOPPED':
      return produce(state, (draft) => {
        const { sender } = event;

        dset(draft, ['players', sender, 'active'], false);
      });
    case 'PLAYER_DEVTOOLS_PLAYER_SELECTED':
      return produce(state, (draft) => {
        const { playerID } = event.payload;
        dset(draft, ['current', 'player'], playerID);
      });
    case 'PLAYER_DEVTOOLS_PLUGIN_SELECTED':
      return produce(state, (draft) => {
        const { pluginID } = event.payload;
        dset(draft, ['current', 'plugin'], pluginID);
      });
    default:
      return state;
  }
};
