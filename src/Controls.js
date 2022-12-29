import React from 'react';

export const Controls = (props) => {
  const {
    actions: {isStarted, play, pause, reset},
  } = props;
  return (
    <div>
      <button onClick={isStarted ? pause : play}>{isStarted ? 'Pause' : 'Play'}</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};
