import React, { useState, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import { globalStyles } from '../styles/global'
import Card from '../components/card';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Home({ navigation }) {
  
  //State
  const [favors, setFavors] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setLoading] = useState(true);

  var WindowsAzure = require('azure-mobile-apps-client');

  // Create a reference to the Azure App Service
  var client = new WindowsAzure.MobileServiceClient('https://favors-app.azurewebsites.net');

  var favorsTable = client.getTable("Favors");
  var keywordsTable = client.getTable("Keywords");

  function successFavors(results) {
    setFavors(results);
  }

  function successKeywords(results) {
    setKeywords(results);
    setLoading(false);
  }

  function failure(error) {
    throw new Error('Error loading data: ', error);
  }

  const fetchFavors = async () => {
    favorsTable
    .read()
    .then(successFavors, failure)
  }

  const fetchKeywords = async () => {
    keywordsTable
    .read()
    .then(successKeywords, failure)
  }

  useEffect(() => {
    fetchFavors(favors)
    fetchKeywords(keywords)
  }, [favors, keywords]);

  
  return (
    <View style={globalStyles.container}>
      {isLoading ? <ActivityIndicator size='large' /> : (
          <FlatList
            data={favors}
            keyExtractor={({ id }, index) => id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={ () => navigation.navigate('FavorDetails', item )}>
                <Card 
                  item={ item } 
                  userFirstName={ navigation.getParam('first_name')}
                  userLastName= {navigation.getParam('last_name')}
                  keywords= { keywords }
                   />
              </TouchableOpacity>
            )}
            />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  
});
