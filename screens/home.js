import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, StyleSheet, View, FlatList, RefreshControl} from 'react-native'
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
  var client = new WindowsAzure.MobileServiceClient('<insert-your-mobileApp-endpoint>');

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
    .orderByDescending('creation_date')
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

   try {
        fetchFavors();
        fetchKeywords();
        setRefreshing(false)
      } catch (error) {
        console.error(error);
      }
  }, [refreshing]);

  
  return (
    <View style={globalStyles.container}>
      {isLoading ? <ActivityIndicator size='large' color='violet'/> : (
          <FlatList
            data={favors}
            keyExtractor={({ id }, index) => id}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
              <Card 
                idUserLoggedIn={navigation.getParam('id')}
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
