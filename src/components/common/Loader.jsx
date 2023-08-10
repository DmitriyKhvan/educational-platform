import React from 'react';
import Loader from 'react-loader-spinner';

const ReactLoader = () => {
  return (
    <Loader
      color="#00BFFF"
      className="w-full h-full bg-slate-400/20 z-[9999] absolute top-0 left-0 flex items-center justify-center"
      type="TailSpin"
      height={80}
      width={80}
    />
  );
};

export default ReactLoader;
