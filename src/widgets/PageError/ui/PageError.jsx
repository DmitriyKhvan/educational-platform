import React from 'react';
import Button from 'src/components/Form/Button';

export const PageError = () => {
  const reloadPage = () => {
    location.reload();
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-medium">Somesing went wrong!!!</h2>

        <Button onClick={reloadPage}>Reload page</Button>
      </div>
    </div>
  );
};
