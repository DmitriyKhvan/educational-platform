import React from 'react';
import Loader from 'react-loader-spinner';

const ReactLoader = () => {
  return (
    <div style={{ zIndex: 9999 }}>
      <Loader
        color="#00BFFF"
        className="align-center"
        type="TailSpin"
        height={80}
        width={80}
      />
    </div>
  );
};

export default ReactLoader;
