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

var WindowsAzure = require('azure-mobile-apps-client');

// Create a reference to the Azure App Service
var client = new WindowsAzure.MobileServiceClient('https://favors-app.azurewebsites.net');

var bookTable = client.getTable("Book");

/**
 * Process the results that are received by a call to table.read()
 *
 * @param {Object} results the results as a pseudo-array
 * @param {int} results.length the length of the results array
 * @param {Object} results[] the individual results
 */
function success(results) {
  var numItemsRead = results.length;

  for (var i = 0 ; i < results.length ; i++) {
      var row = results[i];
      //console.log(row);
  }
}

function failure(error) {
   throw new Error('Error loading data: ', error);
}

/*bookTable
   .read()
   .then(success, failure);*/

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  if (fontsLoaded) {
    return (
      <Navigator theme='light' headerMode='none'/>
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

