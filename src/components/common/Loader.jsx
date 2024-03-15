import React from 'react';
import Loader from 'react-loader-spinner';

const ReactLoader = ({ className = 'absolute', type = 'TailSpin' }) => {
  return (
    <Loader
      color="#00BFFF"
      className={`
        fixed
        bg-slate-400/20 
        z-[10000] 
        top-0 
        left-0 
        bottom-0
        right-0
        flex 
        items-center 
        justify-center
        ${className}
        `}
      type={type}
      height={80}
      width={80}
    />
  );
};

export default ReactLoader;
