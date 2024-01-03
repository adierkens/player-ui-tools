import React from 'react';
import type { PluginClient } from 'flipper-plugin';
import { Layout, usePlugin } from 'flipper-plugin';
import type { Transaction } from '@player-tools/devtools-messenger';
import { Panel } from '@player-tools/devtools-client';

type Events<T extends BaseEvent<string, unknown>> = {
  /**
   *
   */
  'message::plugin': Transaction<T>;
};

type Methods<T extends BaseEvent<string, unknown>> = {
  /**
   *
   */
  'message::flipper': (message: Transaction<T>) => Promise<void>;
};

/**
 *
 */
export function plugin(client: PluginClient<Events<any>, Methods<any>>) {
  const listeners: any[] = [];

  client.onConnect(() => {
    client.onMessage('message::plugin', (message) => {
      listeners.forEach((listener) => listener(message));
    });
  });

  return {
    sendMessage: (message: any) => client.send('message::flipper', message),
    addListener: (listener: any) => {
      listeners.push(listener);
    },
    removeListener: () => {},
  };
}

/**
 *
 */
export const Component = () => {
  const communicationLayer = usePlugin(plugin);
  return (
    <Layout.Container>
      <Panel communicationLayer={communicationLayer} />
    </Layout.Container>
  );
};
