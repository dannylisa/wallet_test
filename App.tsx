
import Navigation from '@/navigation';
import React from 'react';
import { StatusBar } from 'react-native';
import { RecoilRoot } from 'recoil';

const App = () => {
  return (
    <RecoilRoot>
      <StatusBar barStyle='dark-content'/>
      <Navigation />
    </RecoilRoot>
  );
};

export default App;
