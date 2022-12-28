import React from 'react';

export const Controls = (props) => {
  const {run, play, pause} = props;
  return (
    <div>
      <button onClick={run ? pause : play}>{run ? 'Pause' : 'Play'}</button>
    </div>
  );
};
