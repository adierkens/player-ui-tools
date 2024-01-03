import browser from 'webextension-polyfill';

/**
 * proxy messages from plugins to the devtools
 *
 * @param event - The message event.
 */
const messageListener = (event: MessageEvent) => {
  if (event.source === window && event.data?._messenger_) {
    browser.runtime.sendMessage(event.data).catch((e) => {
      // eslint-disable-next-line no-console
      console.log('Error sending message to devtools', e);
    });
  }
};

/**
 *  proxy messages from the devtools to the plugins
 *
 * @param message - The runtime message.
 */
const runtimeMessageListener = (
  message: Parameters<typeof browser.runtime.onMessage.addListener>[0]
) => {
  try {
    window.postMessage(message, '*');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('Error sending message to Player', e);
  }
};

window.addEventListener('message', messageListener);

browser.runtime.onMessage.addListener(runtimeMessageListener);

window.addEventListener('beforeunload', () => {
  // Remove listeners when the page is about to unload
  window.removeEventListener('message', messageListener);
  browser.runtime.onMessage.removeListener(runtimeMessageListener);
});
