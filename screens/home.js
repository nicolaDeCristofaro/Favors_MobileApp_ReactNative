import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import { globalStyles } from '../styles/global'
import Card from '../components/card';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Home({ navigation }) {

  const [favors, setFavors] = useState([]);
  const [isLoading, setLoading] = useState(true);

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
    //var numItemsRead = results.length;
    /*console.log(numItemsRead);

    for (var i = 0 ; i < numItemsRead ; i++) {
        var row = results[i];
        //console.log(row);
        setFavors( favors => [...favors, row]);
    }*/
    setFavors(results);
    setLoading(false);
    //console.log(favors);
  }

  function failure(error) {
    throw new Error('Error loading data: ', error);
  }

  const pressHandler = () => {
    navigation.navigate('FavorDetails');
  }

  useEffect(() => {
    bookTable
      .read()
      .then(success, failure)
  }, []);
  
  return (
    <View style={globalStyles.container}>
      {isLoading ? <ActivityIndicator/> : (
          <FlatList
            data={favors}
            keyExtractor={({ id }, index) => id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={ () => navigation.navigate('FavorDetails', item )}>
                <Card>
                  <Text style={globalStyles.titleText}>{ item.name }</Text>
                </Card>
              </TouchableOpacity>
            )}
            />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  
});
