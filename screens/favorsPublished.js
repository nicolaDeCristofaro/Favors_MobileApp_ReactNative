import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global'
import Ionicons from 'react-native-vector-icons/Ionicons';

function FavorWithButtons({ item , navigation}) {

  const viewCandidatesHandler = () => {
    //ID favor selected to view the candidates -> to test we select a random favor ID
    navigation.navigate('Favor Candidates', {idFavor: item.id})
  }

  return (
    <View style={styles.favorWithButtonsContainer}>
        <View style={styles.favorWithButtonsContent}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.buttonsArea}>
            <TouchableOpacity style={styles.favorButton} onPress={viewCandidatesHandler}>
              <Text style={styles.favorButtonText}>View Candidates</Text>
              <Ionicons name={'chevron-forward-circle'} color='#4B0082' size={30} />
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function FavorsPublished({ navigation }) {

  //State
  const [myFavors, setMyFavors] = useState([]);

  var WindowsAzure = require('azure-mobile-apps-client');
  var client = new WindowsAzure.MobileServiceClient('https://favors-app.azurewebsites.net');
  var favorsTable = client.getTable("Favors");

  function successFavors(results) {
    setMyFavors(results);
  }

  function failure(error) {
    throw new Error('Error loading data: ', error);
  }

  const fetchMyFavors = () => {
    favorsTable
    .where({ id_user: navigation.getParam('id')})
    .read()
    .then(successFavors, failure)
  }

  useEffect(() => {
    fetchMyFavors()
  }, []);

    return (
      <View style={globalStyles.container}>
        <FlatList
          style={{flex:1}}
          data={myFavors}
          renderItem={({ item }) => <FavorWithButtons navigation= {navigation} item={item}/>}
          keyExtractor={item => item.id}
        />
      </View>
    )
}

const styles = StyleSheet.create({
  favorWithButtonsContainer:{
    margin:10,
    padding:10,
    backgroundColor:"#e4d0e3",
    width:"90%",
    flex:1,
    alignSelf:"center",
    borderRadius:10
  },
  favorWithButtonsContent: {
  },
  title: {
    fontWeight:"bold",
    fontSize:24,
  },
  buttonsArea: {
    flexDirection: 'row'
  },
  favorButton: {
    flexDirection: 'row',
    backgroundColor: 'violet',
    borderColor: '#4B0082',
    borderWidth: 5,
    borderRadius:15,
    padding:10,
    margin:5,
    marginLeft:0
  },
  favorButtonText: {
    fontSize:22,
    fontWeight: 'bold',
    color: '#4B0082',
    marginRight:5
  }
});