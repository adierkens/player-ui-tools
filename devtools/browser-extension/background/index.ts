import browser from 'webextension-polyfill';

/**
 * Although the content script can send messages to the dev tools page through the browser.runtime,
 * the latter can't send messages to the content script, given that it doesn't have access to the
 * browser.tabs API. Therefore, we need a background script to serve as a proxy.
 */

browser.runtime.onConnect.addListener((port) => {
  /** proxy messages from the extension to the plugins */
  const listener: Parameters<typeof port.onMessage.addListener>[0] = (
    message
  ) => {
    browser.tabs.sendMessage(message.tabId, message.body).catch((e) => {
      /**
       * mostly connection errors where the receiving end does not exist, which is expected
       * given that the tab might have been closed, or the content script might have been
       * removed, so we ignore them:
       */
      if (
        e.message !==
        'Could not establish connection. Receiving end does not exist.'
      ) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    });
  };

  port.onMessage.addListener(listener);

  /** proxy messages from the plugins to the extension */
  const runtimeListener: Parameters<
    typeof browser.runtime.onMessage.addListener
  >[0] = (message, sender) => {
    if (sender.tab) {
      port.postMessage({
        tabId: sender.tab.id,
        body: message,
      });
    }
  };

  browser.runtime.onMessage.addListener(runtimeListener);

  port.onDisconnect.addListener(() => {
    port.onMessage.removeListener(listener);
    browser.runtime.onMessage.removeListener(runtimeListener);
  });
});
