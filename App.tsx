
import Navigation from '@/navigation';
import React from 'react';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message';
import { RecoilRoot } from 'recoil';


const App = () => {
  
  return (
    <RecoilRoot>
      <StatusBar barStyle='dark-content'/>
      <Navigation />
      <Toast />
    </RecoilRoot>
  );
};

export default App;
