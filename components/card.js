import React, {useState, useEffect} from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Card(props) {
  const [favorsKeywords, setFavorsKeywords] = useState([]);
  const [myKeywords, setMyKeywords] = useState([]);
  const [user, setUser] = useState([]);

  var WindowsAzure = require('azure-mobile-apps-client');
  var client = new WindowsAzure.MobileServiceClient('https://favors-app.azurewebsites.net');
  var favorsKeywordsTable = client.getTable("Favors_Keywords");
  var usersTable = client.getTable("Users");

  function successFavorsKeywords(results) {
    setFavorsKeywords(results);
  }

  function successUsers(results) {
    if (results.length == 1) setUser(results[0]);
  }

  function failure(error) {
    throw new Error('Error loading data: ', error);
  }

  const fetchFavorsKeywords = async () => {
    favorsKeywordsTable
    .where({ idFavor: props.item.id})
    .read()
    .then(successFavorsKeywords, failure)
  }

  const fetchUser = () => {
    usersTable
    .where({ id:  props.item.id_user })
    .read()
    .then(successUsers, failure)
  }

  useEffect(() => {
    fetchUser()
  }, []);

  useEffect(() => {
    fetchFavorsKeywords()
  }, [props.keywords]);

  useEffect(() => {
    var myKeywords = [];

    for(var keyword of favorsKeywords){
      for(var k of props.keywords){
        if( keyword.idKeyword == k.id) myKeywords.push(k.name);
      }
    }

    setMyKeywords(myKeywords);
  }, [favorsKeywords]);

  return (
    <TouchableOpacity onPress={ () => props.navigation.navigate('FavorDetails', {...myKeywords, favorSelected: props.item, idUserLoggedIn: props.idUserLoggedIn} )}>
        <View style={styles.card}>
            <View style={styles.postOwner}>
                <Ionicons name={'ios-person'} size={20} />
                <Text style={{ paddingLeft: 3, fontSize: 18, fontWeight: 'bold'}}> 
                  { user.first_name } { user.last_name } 
                </Text>
            </View>
            <View style={styles.cardContent}>
                <View style={{ padding: 8}}>
                    <Text style={styles.titlePost}> { props.item.title }</Text>
                    <Text style={styles.descriptionPost}> { props.item.description }</Text>
                    <View style={styles.keywordsArea}>
                      {myKeywords.map((value, index) => {
                         return <Text key={index} style={styles.keyword}> #{value} </Text>
                      })}
                    </View>
                    <View style={styles.otherInfoArea}>
                      <Text style={styles.reward}> Reward</Text>
                      <Text style={styles.deadline}>Application Deadline</Text>
                    </View>
                    <View style={styles.otherInfoArea}>
                      <Text style={styles.reward}> { props.item.reward } €</Text>
                      <Text style={styles.deadline}>{ props.item.application_deadline.toUTCString() }</Text>
                    </View>
                </View>
            </View>
        </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    elevation: 1,
    backgroundColor: '#e4d0e3',
    overflow: 'hidden',
    marginHorizontal: 1,
    marginVertical: 6,
    width: '100%',
  },
  cardContent: {
    marginVertical: 5,
    flexDirection: 'row',
  },
  postOwner: {
      flexDirection: 'row',
      padding: 10,
      paddingBottom: 5,
      fontWeight: 'bold',
      backgroundColor: 'violet',
  },
  titlePost: {
    fontWeight: 'bold',
    color: '#45103E',
    fontSize: 22,
  },
  descriptionPost: {
    color: '#45103E',
    fontSize: 16,
    marginLeft:4,
  },
  keywordsArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop:5,
    marginLeft: 5,
  },
  keyword: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'violet',
    marginTop:1,
    marginRight: 5,
    padding: 1,
    borderRadius: 5,
  },
  otherInfoArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop:5,
    marginLeft: 5,
    marginRight: 15,
  },
  reward: {
    fontWeight: 'bold',
    color: '#228B22',
    fontSize: 16,
  },
  deadline: {
    color: '#8b0000',
    fontWeight: 'bold',
    fontSize: 16,
  }
});