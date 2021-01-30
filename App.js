import './shim';
import 'react-native-get-random-values'
import React, { useState } from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import Navigator from './routes/stack';

const getFonts = () => {
  return Font.loadAsync({
    "sf-pro-text-bold": require("./assets/fonts/SF-Pro-Text-Bold.otf"),
    "sf-pro-text-regular": require("./assets/fonts/SF-Pro-Text-Regular.otf"),
    "sf-pro-text-semibold": require("./assets/fonts/SF-Pro-Text-Semibold.otf"),
  });
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  if (fontsLoaded) {
    return (
      <Navigator theme='light' headerMode='none' style={{flex: 1}} />
    );
  } else {
    return (
      <AppLoading 
        startAsync={getFonts} 
        onFinish={() => setFontsLoaded(true)}
        onError={console.warn}
      />
    )
  }

}

