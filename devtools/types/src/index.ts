import type {
  BaseEvent,
  BeaconEvent,
  DisconnectEvent,
  MessengerEvent,
  MessengerOptions,
  TransactionMetadata,
} from '@player-tools/devtools-messenger';
import type { Binding, Flow, Schema, View } from '@player-ui/types';

/** Plugin data */
export interface PluginData {
  /** Plugin id */
  id: string;
  /** Plugin version */
  version: string;
  /** Plugin name */
  name: string;
  /** Plugin description */
  description: string;
  /** Plugin UI */
  flow: Flow;
}

export interface ExtensionState {
  /** currently being inspected */
  current: {
    /** player */
    player: string | null;
    /** plugin */
    plugin: string | null;
  };
  /**  */
  players: Record<
    string,
    {
      /** registeredPlugins */
      plugins: Record<string, PluginData>;
      /** active */
      active: boolean;
    }
  >;
}

interface InitPayload {
  /** Devtools plugins */
  plugins: Record<string, PluginData>;
}

interface FlowChangePayload {
  /** Flow */
  flow: Partial<Flow>;
  /** Plugin ID */
  pluginID: string;
}

interface DataChangePayload {
  /** Data */
  data: Flow['data'];
  /** Plugin ID */
  pluginID: string;
}

interface EventsBatchPayload {
  /** Events */
  events: Array<TransactionMetadata & MessengerEvent<ExtensionSupportedEvents>>;
}

export type PlayerInitEvent = BaseEvent<
  'PLAYER_DEVTOOLS_PLAYER_INIT',
  InitPayload
>;

export type DevtoolsFlowChangeEvent = BaseEvent<
  'PLAYER_DEVTOOLS_PLUGIN_FLOW_CHANGE',
  FlowChangePayload
>;

export type DevtoolsDataChangeEvent = BaseEvent<
  'PLAYER_DEVTOOLS_PLUGIN_DATA_CHANGE',
  DataChangePayload
>;

export type PlayerStoppedEvent = BaseEvent<
  'PLAYER_DEVTOOLS_PLAYER_STOPPED',
  null
>;

export type DevtoolsEventsBatchEvent = BaseEvent<
  'MESSENGER_EVENT_BATCH',
  EventsBatchPayload
>;

export type ExtensionSelectedPlayerEvent = BaseEvent<
  'PLAYER_DEVTOOLS_PLAYER_SELECTED',
  {
    /** Player ID */
    playerID: string;
  }
>;

export type ExtensionSelectedPluginEvent = BaseEvent<
  'PLAYER_DEVTOOLS_PLUGIN_SELECTED',
  {
    /** Plugin ID */
    pluginID: string;
  }
>;

export type ExtensionSupportedEvents =
  | PlayerInitEvent
  | DevtoolsFlowChangeEvent
  | DevtoolsDataChangeEvent
  | PlayerStoppedEvent
  | DevtoolsEventsBatchEvent
  | ExtensionSelectedPlayerEvent
  | ExtensionSelectedPluginEvent
  | BeaconEvent
  | DisconnectEvent;

export type CommunicationLayerMethods = Pick<
  MessengerOptions<ExtensionSupportedEvents>,
  'sendMessage' | 'addListener' | 'removeListener'
>;

/** Payload for the data changed event */
type PlayerDataChangedPayload = {
  /** Plugin id */
  pluginID: string;
  /** Data bindings */
  bindings: Binding;
  /** Old value */
  oldValue: unknown;
  /** New value */
  newValue: unknown;
};

/** Payload for the view changed event */
type PlayerViewChangedPayload = {
  /** View */
  view: View;
};

/** Payload for the flow transitioned event */
type PlayerFlowTransitionedPayload = {
  /** Initial transition state */
  fromState: string;
  /** Final transition state */
  toState: string;
};

/** Payload for the data evaluation event */
type PlayerDataEvaluatedPayload = {
  /** Binding */
  binding: Binding;
  /** Current input */
  currentValue: unknown;
  /** Formatted value */
  formattedValue: unknown;
  /** Value stored into the model */
  modelValue: unknown;
  /** Data type */
  type?: Schema.DataType;
};

/** Payload for the init event */
type PlayerInitPayload = {
  /** Plugins to be registered into the extension */
  plugins: Record<string, PluginData>;
  /** Player ID **/
  playerID: string;
};

/** Event emitted when a player is initialized */
export type PlayerInit = BaseEvent<'devtools-player-init', PlayerInitPayload>;

/** Event emitted when a player is removed */
export type PlayerRemoved = BaseEvent<'devtools-player-removed', undefined>;

/** Event emitted when a player data is changed */
export type PlayerDataChanged = BaseEvent<
  'devtools-player-data-changed',
  PlayerDataChangedPayload
>;

/** Event emitted when a player view is changed */
export type PlayerViewChanged = BaseEvent<
  'devtools-player-view-changed',
  PlayerViewChangedPayload
>;

/** Event emitted when a player flow is transitioned */
export type PlayerFlowTransition = BaseEvent<
  'devtools-player-flow-transition',
  PlayerFlowTransitionedPayload
>;

/** Event emitted when a player flow is ended */
export type PlayerFlowEndEvent = BaseEvent<
  'devtools-player-flow-end',
  undefined
>;

/** Event emitted when a data is evaluated */
export type PlayerDataEvaluated = BaseEvent<
  'devtools-player-data-evaluated',
  PlayerDataEvaluatedPayload
>;

/** Runtime event */
export type RuntimeEvent =
  | PlayerInit
  | PlayerRemoved
  | PlayerDataChanged
  | PlayerViewChanged
  | PlayerFlowTransition
  | PlayerFlowEndEvent
  | PlayerDataEvaluated;

/** Interface representing the Devtools Plugins Store. */
export interface DevtoolsPluginsStore {
  /** Plugins data. */
  plugins: Record<string, PluginData>;

  /** Array of supported events. */
  messages: Array<ExtensionSupportedEvents>;
}
