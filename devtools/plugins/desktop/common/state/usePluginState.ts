/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useReducer, useRef } from 'react';
import uid from 'tiny-uid';
import { Messenger } from '@player-tools/devtools-messenger';
import type { MessengerOptions } from '@player-tools/devtools-messenger';
import type {
  DevtoolsPluginsStore,
  ExtensionSupportedEvents,
  RuntimeEvent,
} from '@player-tools/devtools-types';
import { reducer } from './reducer';
import { useCommunicationLayer } from '../communication-layer';

const id = uid();

const INITIAL_STATE: DevtoolsPluginsStore = {
  messages: [],
  plugins: {},
};

export const usePluginState = (): [
  DevtoolsPluginsStore,
  string,
  React.Dispatch<RuntimeEvent | ExtensionSupportedEvents>
] => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const lastMessageIndex = useRef<number>(-1);
  const { sendMessage, addListener, removeListener } = useCommunicationLayer();

  const messenger = useMemo(() => {
    const options: MessengerOptions<ExtensionSupportedEvents> = {
      id,
      context: 'player',
      messageCallback: dispatch,
      sendMessage,
      addListener,
      removeListener,
      logger: console,
    };

    return new Messenger(options);
  }, [addListener, removeListener, sendMessage]);

  useEffect(() => {
    if (state.messages.length > lastMessageIndex.current + 1) {
      const messages = state.messages.slice(
        lastMessageIndex.current + 1,
        state.messages.length
      );
      lastMessageIndex.current = state.messages.length - 1;
      messages.forEach((message) => {
        messenger.sendMessage(message as any);
      });
    }
  }, [state.messages, messenger]);

  return [state, id, dispatch];
};
