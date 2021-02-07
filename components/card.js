import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Card(props) {
  const [favorsKeywords, setFavorsKeywords] = useState([]);
  const [myKeywords, setMyKeywords] = useState([]);



  var WindowsAzure = require('azure-mobile-apps-client');
  var client = new WindowsAzure.MobileServiceClient('https://favors-app.azurewebsites.net');
  var favorsKeywordsTable = client.getTable("Favors_Keywords");

  function successFavorsKeywords(results) {
    setFavorsKeywords(results);
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

  useEffect(() => {
    fetchFavorsKeywords()

    var myKeywords = [];

    for(var keyword of favorsKeywords){
      for(var k of props.keywords){
        if( keyword.idKeyword == k.id) myKeywords.push(k.name);
      }
    }

    setMyKeywords(myKeywords);

  }, []);

  return (
    <View>
        <View style={styles.card}>
            <View style={styles.postOwner}>
                <Ionicons name={'ios-person'} size={18} />
                <Text style={{ paddingTop: 1, fontSize: 16, fontWeight: 'bold'}}> 
                  { props.userFirstName } { props.userLastName } 
                </Text>
            </View>
            <View style={styles.cardContent}>
                <Image
                source={require("../assets/home-cleaning.jpg")}
                style={{
                    height: 115,
                    width: '100%',
                }}
                />
                <View style={{ padding: 10, width: '100%' }}>
                    <Text style={styles.titlePost}> { props.item.title }</Text>
                    <View style={styles.keywordsArea}>
                      {myKeywords.map((value, index) => {
                         return <Text key={index} style={styles.keyword}> #{value} </Text>
                      })}
                    </View>
                </View>
            </View>
        </View>
    </View>
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
  },
  postOwner: {
      flexDirection: 'row',
      padding: 10,
      paddingBottom: 5,
      fontWeight: 'bold',
  },
  titlePost: {
    fontWeight: 'bold',
    color: '#320032',
    fontSize: 16,
  },
  keywordsArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  }
});