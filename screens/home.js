import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, FlatList, RefreshControl} from 'react-native'
import { globalStyles } from '../styles/global'
import Card from '../components/card';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Home({ navigation }) {
  
  //State
  const [favors, setFavors] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const fetchFavors = () => {
    favorsTable
    .read()
    .then(successFavors, failure)
  }

  const fetchKeywords = () => {
    keywordsTable
    .read()
    .then(successKeywords, failure)
  }

  useEffect(() => {
    fetchFavors()
    fetchKeywords()
    
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    const toBeUpdated = async () => {
      try {
          const jsonValue = await AsyncStorage.getItem('@toUpdate');
          await AsyncStorage.setItem('@toUpdate', JSON.stringify(false));
          return JSON.parse(jsonValue);
      } catch(e) {
          console.log(e);
      }
    }
    var toReload = await toBeUpdated()

    console.log(toReload);
    if (toReload) {
      //It is inserted a new favor so on refresh you should call again fetch from DB
      try {
        fetchFavors();
        fetchKeywords();
        setRefreshing(false)
      } catch (error) {
        console.error(error);
      }
    }
    else{
      alert('No more new data available');
      setRefreshing(false);
    }
  }, [refreshing]);

  
  return (
    <View style={globalStyles.container}>
      {isLoading ? <ActivityIndicator size='large' /> : (
          <FlatList
            data={favors}
            keyExtractor={({ id }, index) => id}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
              <Card 
                item={ item } 
                keywords= { keywords }
                navigation={ navigation }
                  />
            )}
            />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  
});
