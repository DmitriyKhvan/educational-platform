import React from 'react';
import { AppRouter } from './providers/router';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <AppRouter />
      <Toaster />
    </>
  );
}

export default App;
