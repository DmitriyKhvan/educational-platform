import React from 'react';
import Loader from 'react-loader-spinner';

const ReactLoader = ({ className = 'absolute' }) => {
  return (
    <div className="relative w-full h-full">
      <Loader
        color="#00BFFF"
        className={`
        w-full 
        h-full 
        bg-slate-400/20 
        z-[10000] 
        top-0 
        left-0 
        flex 
        items-center 
        justify-center
        ${className}
        `}
        type="TailSpin"
        height={80}
        width={80}
      />
    </div>
  );
};

export default ReactLoader;
