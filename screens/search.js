import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View, FlatList, Keyboard } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { globalStyles } from '../styles/global'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Card from '../components/card';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function Search({ navigation }) {

  const [favors, setFavors] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentUser, setCurrentUser] = useState({});


    //Get the user logged ind from AsyncStorage
    useEffect(() => {
      const getData = async () => {
          try {
              const jsonValue = await AsyncStorage.getItem('@user');
              if (jsonValue != null) setCurrentUser(JSON.parse(jsonValue));
          } catch(e) {
              console.log(e);
          }
      }
      getData()
  }, []);


  var WindowsAzure = require('azure-mobile-apps-client');
  var client = new WindowsAzure.MobileServiceClient('<insert-your-mobileApp-endpoint>');
  var favorsTable = client.getTable("Favors");
  var keywordsTable = client.getTable("Keywords");

  function successFavors(results) {
    setFavors(results);
  }

  function successKeywords(results) {
    setKeywords(results);
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


    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={globalStyles.container}>
          <View style={styles.searchView}>
            <TextInput
              style={styles.searchTextStyle}
              placeholder='Type here...'
              placeholderTextColor="#fff"
              onChangeText={text => setSearchText(text)}
            />
            <View style={styles.searchButtonArea}>
              <Ionicons style={styles.searchIcon} name={'search'} color='white' size={20} />
            </View>
        </View>

        <FlatList
            data={favors}
            keyExtractor={({ id }, index) => id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Card 
                idUserLoggedIn={currentUser.id}
                searchText={ searchText }
                item={ item } 
                keywords= { keywords }
                navigation={ navigation }
                  />
            )}
            />
      </View>
      </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
  searchView:{
    flexDirection: 'row',
    width:"100%",
    backgroundColor:"#465881",
    borderRadius:25,
    height:50,
    marginBottom: 15
  },
  searchTextStyle:{
    color:"#ff87d7",
    fontSize:17,
    padding:5,
    marginLeft:'5%',
  },
  searchButtonArea: {
    flexDirection: 'row',
    padding:10,
    alignSelf: 'flex-end',
    backgroundColor: 'violet',
    height:50,
    marginLeft:'50%',
    borderRadius:25,
    width:'20%'
  },
  searchIcon: {
    alignSelf: 'center',
    paddingLeft:'30%'
  }
});