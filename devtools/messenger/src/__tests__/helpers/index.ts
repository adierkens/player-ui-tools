/* eslint-disable @typescript-eslint/no-explicit-any */
type MessengerSpies = {
  /** sendMessage mock */
  sendMessage: jest.Mock;
  /** addListener mock */
  addListener: jest.Mock;
  /** removeListener mock */
  removeListener: jest.Mock;
  /** messageCallback mock */
  messageCallback: jest.Mock;
};

/**
 * Mocked messaging API (e.g., window.postMessage, browser.runtime.sendMessage)
 */
export class MockedMessagingAPI {
  private listeners: Set<(event: any) => void> = new Set();

  // eslint-disable-next-line no-useless-constructor
  constructor(private spies: Array<MessengerSpies>) {}

  addListener(callback: (event: any) => void) {
    this.spies.forEach(({ addListener }) => addListener(callback));

    this.listeners.add(callback);
  }

  removeListener(callback: (event: any) => void) {
    this.spies.forEach(({ removeListener }) => removeListener(callback));

    this.listeners.delete(callback);
  }

  async sendMessage(event: any, fail = false) {
    this.spies.forEach(({ sendMessage }) => sendMessage(event));

    if (fail) {
      throw new Error('Failed to send message');
    }

    this.listeners.forEach((listener) => listener(event));
  }
}

/** generates a mock messaging API with two contexts for testing purposes */
export function createMockContext() {
  const spies = {
    web: {
      sendMessage: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      messageCallback: jest.fn(),
    },
    devtools: {
      sendMessage: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      messageCallback: jest.fn(),
    },
  };

  const mockMessagingAPI = new MockedMessagingAPI([spies.web, spies.devtools]);

  return {
    spies,
    mockMessagingAPI,
  };
}
