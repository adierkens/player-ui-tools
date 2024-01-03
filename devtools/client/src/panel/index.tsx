/* eslint-disable jsx-a11y/label-has-associated-control */
import type { MessengerOptions } from '@player-tools/devtools-messenger';
import type { ExtensionSupportedEvents } from '@player-tools/devtools-types';
import React, { useReactPlayer } from '@player-ui/react';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { INITIAL_FLOW, PLAYER_CONFIG } from '../constants';
import { useExtensionState } from '../state';

/** Error boundary fallback component */
const fallbackRender: ErrorBoundary['props']['fallbackRender'] = ({
  error,
}) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
};

/**
 * Panel component
 *
 * devtools plugin authors can define their plugins content using DSL and have it rendered here
 */
export const Panel = ({
  communicationLayer,
}: {
  /** the communication layer to use for the extension */
  communicationLayer: Pick<
    MessengerOptions<ExtensionSupportedEvents>,
    'sendMessage' | 'addListener' | 'removeListener'
  >;
}) => {
  const { state, selectPlayer, selectPlugin } = useExtensionState({
    communicationLayer,
  });
  const { reactPlayer } = useReactPlayer(PLAYER_CONFIG);

  useEffect(() => {
    const { player, plugin } = state.current;

    const flow =
      player && plugin
        ? state.players[player]?.plugins?.[plugin]?.flow || INITIAL_FLOW
        : INITIAL_FLOW;

    reactPlayer.start(flow);
  }, [reactPlayer, state]);

  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <>
        {state.current.player && (
          <>
            <div>
              <label htmlFor="player">Player:</label>
              <select
                id="player"
                value={state.current.player || ''}
                onChange={(event) => selectPlayer(event.target.value)}
              >
                {Object.keys(state.players).map((playerID) => (
                  <option key={playerID} value={playerID}>
                    {playerID}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="plugin">Plugin:</label>
              <select
                id="plugin"
                value={state.current.plugin || ''}
                onChange={(event) => selectPlugin(event.target.value)}
              >
                {Object.keys(state.players[state.current.player].plugins).map(
                  (pluginID) => (
                    <option key={pluginID} value={pluginID}>
                      {pluginID}
                    </option>
                  )
                )}
              </select>
            </div>
            <hr />
          </>
        )}
        <div className="component-wrapper">
          <reactPlayer.Component />
        </div>
        <hr />
        <details>
          <summary>State</summary>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </details>
      </>
      );
    </ErrorBoundary>
  );
};
