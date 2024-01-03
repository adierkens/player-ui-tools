export interface BaseEvent<T extends string, P> {
  /** Event type */
  type: T;
  /** Event payload */
  payload: P;
}

export type TransactionMetadata = {
  /** Unique ID */
  id: number;
  /** Timestamp */
  timestamp: number;
  /** Sender ID */
  sender: string;
  /** Target ID */
  target?: string;
  /** Context */
  context: 'player' | 'devtools';
  /** Messenger tag */
  _messenger_: boolean;
};

export type BeaconEvent = BaseEvent<'MESSENGER_BEACON', null>;

export type EventsBatchEvent<T extends BaseEvent<string, unknown>> = BaseEvent<
  'MESSENGER_EVENT_BATCH',
  {
    /** Array of Events */
    events: (MessengerEvent<T> & TransactionMetadata)[];
  }
>;

export type RequestLostEventsEvent = BaseEvent<
  'MESSENGER_REQUEST_LOST_EVENTS',
  {
    /** Last received message id */
    lastReceivedMessageId: number;
  }
>;

export type DisconnectEvent = BaseEvent<'MESSENGER_DISCONNECT', null>;

export type InternalEvent<T extends BaseEvent<string, unknown>> =
  | BeaconEvent
  | RequestLostEventsEvent
  | EventsBatchEvent<T>
  | DisconnectEvent;

export type MessengerEvent<T extends BaseEvent<string, unknown>> =
  | T
  | InternalEvent<T>;

export type Transaction<T extends BaseEvent<string, unknown>> =
  TransactionMetadata & MessengerEvent<T>;

export type Connection = {
  /** Target ID */
  id: string;
  /** Last sent message id */
  lastSentMessageId: number;
  /** Last received message id */
  lastReceivedMessageId: number;
  /** Lost events since the last one received */
  desync: boolean;
};

/** Messenger options */
export interface MessengerOptions<T extends BaseEvent<string, unknown>> {
  /** API to send messages (e.g. window.postMessage, browser.runtime.sendMessage) */
  sendMessage: (message: MessengerEvent<T>) => Promise<void>;
  /** API to add a listener (e.g. window.addEventListener, browser.runtime.onMessage.addListener) */
  addListener: (
    callback: (message: TransactionMetadata & MessengerEvent<T>) => void
  ) => void;
  /** API to remove a listener (e.g. window.removeEventListener, browser.runtime.onMessage.removeListener) */
  removeListener: (
    callback: (message: TransactionMetadata & MessengerEvent<T>) => void
  ) => void;
  /** Callback to handle messages */
  messageCallback: (message: TransactionMetadata & MessengerEvent<T>) => void;
  /** Context */
  context: 'player' | 'devtools';
  /** Unique id */
  id?: string;
  /** Time between beacons in ms */
  beaconIntervalMS?: number;
  /** Debug mode */
  debug?: boolean;
  /** Handle failed message */
  handleFailedMessage?: (message: Transaction<T>) => void;
  /** Logger */
  logger: {
    /** Log message */
    log: (...args: Array<unknown>) => void;
  };
}
