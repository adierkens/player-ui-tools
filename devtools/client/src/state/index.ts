import type { MessengerOptions } from '@player-tools/devtools-messenger';
import { Messenger } from '@player-tools/devtools-messenger';
import type { ExtensionSupportedEvents } from '@player-tools/devtools-types';
import { useCallback, useEffect, useMemo, useReducer } from 'react';

import { INITIAL_EXTENSION_STATE } from '../constants';
import { reducer } from './reducer';

/** Extension state */
export const useExtensionState = ({
  communicationLayer,
}: {
  /** the communication layer to use for the extension */
  communicationLayer: Pick<
    MessengerOptions<ExtensionSupportedEvents>,
    'sendMessage' | 'addListener' | 'removeListener'
  >;
}) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_EXTENSION_STATE);

  const messengerOptions = useMemo<MessengerOptions<ExtensionSupportedEvents>>(
    () => ({
      context: 'devtools',
      target: 'player',
      messageCallback: (message) => {
        dispatch(message);
      },
      ...communicationLayer,
      logger: console,
    }),
    [dispatch, communicationLayer]
  );

  const messenger = useMemo(
    () => new Messenger(messengerOptions),
    [messengerOptions]
  );

  useEffect(() => {
    return () => {
      messenger.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectPlayer = useCallback(
    (playerID: string) => {
      dispatch({
        id: -1,
        sender: 'internal',
        context: 'devtools',
        _messenger_: false,
        timestamp: Date.now(),
        type: 'PLAYER_DEVTOOLS_PLAYER_SELECTED',
        payload: {
          playerID,
        },
      });
    },
    [dispatch]
  );

  const selectPlugin = useCallback(
    (pluginID: string) => {
      dispatch({
        id: -1,
        sender: 'internal',
        context: 'devtools',
        _messenger_: false,
        timestamp: Date.now(),
        type: 'PLAYER_DEVTOOLS_PLUGIN_SELECTED',
        payload: {
          pluginID,
        },
      });
    },
    [dispatch]
  );

  return { state, selectPlayer, selectPlugin };
};
