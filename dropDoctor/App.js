import React, {useEffect} from 'react';
import '@/utils/moment'; //国际化moment//
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import store from '@/store'; //引入redux
import {save_userdata} from '@/store/actions'; //引入redux
import Route from '@/navigators';
import {storage} from '@/storage';
import {ToastCom} from '@/components';
export default function App() {
  useEffect(() => {
    showStatusBar();
    storage.load('userdata', userdata => {
      if (userdata) store.dispatch(save_userdata(userdata));
    });
    return () => {};
  }, []);
  function showStatusBar() {
    setTimeout(() => {
      StatusBar.setBackgroundColor('rgba(0,0,0,0)');
      StatusBar.setBarStyle('dark-content');
      StatusBar.setTranslucent(true);
    }, 300);
  }

  return (
    <Provider store={store}>
      {/* <StatusBar
        barStyle="dark-content"
        backgroundColor="rgba(0,0,0,0)"
        translucent
      /> */}
      <Route />
      <ToastCom />
    </Provider>
  );
}
