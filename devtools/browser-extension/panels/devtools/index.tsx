import { Panel } from '@player-tools/devtools-client';
import type { CommunicationLayerMethods } from '@player-tools/devtools-types';
import React from 'react';
import ReactDOM from 'react-dom';
import browser from 'webextension-polyfill';

const port = browser.runtime.connect();

const communicationLayer: CommunicationLayerMethods = {
  sendMessage: async (message) =>
    port.postMessage({
      tabId: browser.devtools.inspectedWindow.tabId,
      body: message,
    }),
  addListener: (callback) => {
    port.onMessage.addListener(({ body }) => callback(body));
  },
  removeListener: (callback) => {
    port.onMessage.removeListener(callback);
  },
};

ReactDOM.render(
  <Panel communicationLayer={communicationLayer} />,
  document.getElementById('root')
);
