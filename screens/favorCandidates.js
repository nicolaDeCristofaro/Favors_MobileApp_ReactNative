import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global'

function CandidateItem({ item }) {
  return (

    <View style={styles.listItem}>
      <Image source={{uri:item.thumbnail_uri}}  style={{width:120, height:120,borderRadius:30}} />
      <View style={styles.candidateInfoArea}>
        <Text style={styles.textInfoName}>{item.first_name} {item.last_name}</Text>
        <Text style={styles.textInfo}>{item.nationality}, {item.living_country}</Text>
        <Text style={{...styles.textInfo,...{fontWeight: 'bold', color: 'purple'}}}>Accuracy Index: {item.accuracy_index}</Text>
        <Text style={{...styles.textInfo,...{fontWeight: 'bold', color: 'purple'}}}>Reliability Index: {item.reliability_index}</Text>
        <Text style={{...styles.textInfo,...{fontWeight: 'bold'}}}>{item.email}</Text>
      </View>
    </View>
  );
}

export default function FavorCandidates({ navigation }) {

    const [favorCandidations, setFavorCandidations] = useState([]);
    const [users, setUsers] = useState([]);
    const [favorsCandidates, setFavorsCandidates] = useState([]);


    var WindowsAzure = require('azure-mobile-apps-client');
    var client = new WindowsAzure.MobileServiceClient('https://favors-app.azurewebsites.net');
    var favorsCandidatesTable = client.getTable("Favors_Candidates");
    var usersTable = client.getTable("Users");

    function successFavorsCandidates(results) {
      if (results.length > 0) setFavorsCandidates(results);
    }
    
    function successUsers(results) {
      setUsers(results);
    }
  
    function failure(error) {
      throw new Error('Error loading data: ', error);
    }
  
    const fetchFavorsCandidates = () => {
      favorsCandidatesTable
      .where({ idFavor: navigation.getParam('idFavor')})
      .read()
      .then(successFavorsCandidates, failure)
    }

    const fetchUsers = () => {
      usersTable
      .read()
      .then(successUsers, failure)
    }

    useEffect(() => {
      fetchFavorsCandidates()
      fetchUsers()
    }, []);

    useEffect(() => {
      if ( favorsCandidates.length > 0
          && users.length > 0){
            var favCandidations = [];
  
            for(var c of favorsCandidates){
              for(var u of users){
                if( c.idUser == u.id) favCandidations.push(u);
              }
            }
        
            setFavorCandidations(favCandidations);
          }
    }, [favorsCandidates, users]);


    return (
      <View style={globalStyles.container}>
        {favorCandidations.length > 0 
          ?
          <FlatList
            style={{flex:1}}
            data={favorCandidations}
            renderItem={({ item }) => <CandidateItem item={item}/>}
            keyExtractor={item => item.id}
          />
          :
          <Text style={{fontWeight:"bold",fontSize:22, color:'violet'}}>There are no candidates for this favor. Please be patient!</Text>
        }
      </View>
    )
}

const styles = StyleSheet.create({
  listItem:{
    margin:10,
    padding:10,
    backgroundColor: '#e4d0e3',
    width:"90%",
    flex:1,
    alignSelf:"center",
    flexDirection:"row",
    borderRadius:5
  },
  candidateInfoArea: {
    alignItems:"flex-start",
    flex:1,
    padding:5,
    paddingLeft:10
  },
  textInfoName: {
    fontSize:22,
    fontWeight:"bold"
  },
  textInfo:{
    fontSize:18
  }
});