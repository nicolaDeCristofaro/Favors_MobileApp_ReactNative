import React, {useState, useEffect} from 'react'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { Card } from 'react-native-elements'
import { globalStyles } from '../styles/global'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Account({ navigation }) {

    const [currentUser, setCurrentUser] = useState([]);

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

    useEffect(() => {
    }, [currentUser]);

  const favorsPublishedHandler = () => {
    navigation.navigate('Favors Published', currentUser);
  }

    return (
      <ScrollView style={styles.scroll}>
        <View style={globalStyles.container}>
          <Card containerStyle={styles.cardContainer}>
          <View style={styles.headerContainer}>
              <View style={styles.headerColumn}>
              <Image
                  style={styles.userImage}
                  source={{uri:currentUser.thumbnail_uri}}
                />
                <Text style={styles.userNameText}> {currentUser.first_name} {currentUser.last_name}</Text>
                <View style={styles.userAddressRow}>
                  <View style={styles.userCityRow}>
                    <Text style={styles.userCityText}>
                      From: {currentUser.nationality}
                    </Text>
                    <Text style={styles.userCityText}>
                      Living in: {currentUser.living_country}
                    </Text>
                  </View>
                </View>
              </View>
          </View>
          </Card>

          <View style={styles.indexArea}>
            <View style={styles.subAreaAccuracy}>
                <Ionicons name={'alarm'} color='#4B0082' size={30} />
                <Text style={styles.accuracyLabel}>Accuracy Index</Text>
                <Text style={styles.explanation}>(Average accuracy level from reviews)</Text>
                <Text style={styles.accuracy}>{currentUser.accuracy_index} </Text>
            </View>
              <View style={styles.subAreaReliability}>
                <Ionicons name={'chevron-down-circle'} color='#4B0082' size={30} />
                <Text style={styles.reliabilityLabel}>Reliability Index</Text>
                <Text style={styles.explanation}>(Number of favors exhausted)</Text>
                <Text style={styles.reliability}>{currentUser.reliability_index} </Text>
            </View>
        </View>

        <TouchableOpacity onPress={favorsPublishedHandler}>
          <View style={styles.favorsPublishedLink}>
            <Text style={styles.textLinkFavorsPublished}>View Favors Published</Text>
            <Ionicons name={'caret-forward-outline'} color='white' size={30} />
        </View>
        </TouchableOpacity>

        </View>
        
      </ScrollView>
    )
}

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: 0,
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: '#171F33',
  },
  headerContainer: {},
  headerColumn: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  scroll: {
    backgroundColor: '#171F33',
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userCityRow: {
    backgroundColor: 'transparent',
  },
  userCityText: {
    color: '#A5A5A5',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  userImage: {
    borderColor: '#ff3abd',
    borderRadius: 85,
    borderWidth: 5,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
  userNameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
  indexArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft:5,
    marginTop:30,
  },
  subAreaAccuracy:{
    marginRight: 10,
    padding:10,
    flex:1,
    borderColor: '#ff3abd',
    backgroundColor: '#D8BFD8',
    borderWidth: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  accuracyLabel: {
    color: '#ff3abd',
    fontWeight: 'bold',
    fontSize: 18,
  },
  accuracy: {
    color: '#4B0082',
    fontWeight: 'bold',
    fontSize: 38,
  },
  explanation: {
    fontSize: 16,
    color: 'black',
    marginLeft: 10
  },
  subAreaReliability:{
    marginRight: 10,
    padding:10,
    flex:1,
    borderColor: '#ff3abd',
    backgroundColor: '#D8BFD8',
    borderWidth: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  reliabilityLabel: {
    color: '#ff3abd',
    fontWeight: 'bold',
    fontSize: 18,
  },
  reliability: {
    color: '#4B0082',
    fontWeight: 'bold',
    fontSize: 38,
  },
  favorsPublishedLink: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight:25,
    marginTop:30,
  },
  textLinkFavorsPublished: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
  }
})