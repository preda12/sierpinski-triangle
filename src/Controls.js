import React from 'react';

export const Controls = (props) => {
  const {
    actions: {isStarted, play, pause, reset, showStartingPoint},
    isStartingPointShown,
  } = props;

  return (
    <div>
      <button onClick={isStarted ? pause : play}>{isStarted ? 'Pause' : 'Play'}</button>
      <button onClick={reset}>Reset</button>
      <div>
        <input
          type="checkbox"
          id="show_starting_point"
          name="show_starting_point"
          value="true"
          onChange={(event) => showStartingPoint(event.target.checked)}
          checked={isStartingPointShown}
        />
        <label htmlFor="show_starting_point"> Show starting point</label>
      </div>
    </div>
  );
};
