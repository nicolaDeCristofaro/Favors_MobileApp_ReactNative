import React, {useState, useEffect} from 'react'
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { globalStyles } from '../styles/global'
import uuid from 'react-native-uuid';


export default function FavorDetails({ navigation }) {

    const [isCandidated, setIsCandidated] = useState(false);

    var WindowsAzure = require('azure-mobile-apps-client');
    var client = new WindowsAzure.MobileServiceClient('https://favors-app.azurewebsites.net');
    var favorsCandidatesTable = client.getTable("Favors_Candidates");

    function successFavorsCandidates(results) {
      //console.log(results);
      if (results.length > 0) setIsCandidated(true);
    }

    function failure(error) {
      throw new Error('Error loading data: ', error);
    }

    const fetchFavorsCandidates = () => {
      favorsCandidatesTable
      .where({ idUser: navigation.getParam('id_user'), idFavor: navigation.getParam('id')})
      .read()
      .then(successFavorsCandidates, failure)
    }

    useEffect(() => {
      fetchFavorsCandidates()
    }, []);

    const pressHandler = () => {
      //Insert entry in DB table Favors_Candidates

      //Create the object to insert
      const fav_cand = {id: uuid.v4(), idUser: navigation.getParam('id_user'),idFavor: navigation.getParam('id')}
      favorsCandidatesTable
                .insert(JSON.stringify(fav_cand))
                .done( function(insertedItem) {
                    //Inform the user of the candidation
                    Alert.alert(
                        "CANDIDATION SUCCESSFULL",
                        "You are candidated successfully.",
                        [{
                            text: 'OK',
                            onPress: () => {
                              setIsCandidated(true);
                            }
                        }]);
                }, function (error) {
                    console.error('Error loading data: ', error);
                });
    }

    return (
    <View style={globalStyles.container}>
        <Text style={styles.titlePostDetails}> {navigation.getParam('title')} </Text>
        <Text style={styles.descPostDetails}> {navigation.getParam('description')} </Text>
        <View style={styles.otherInfoArea}>
            <View style={ {...styles.infoSubArea, ...styles.subAreaReward}}>
              <Text style={styles.rewardLabel}> Reward</Text>
              <Text style={styles.reward}> {navigation.getParam('reward')} €</Text>
            </View>
            <View style={{...styles.infoSubArea,...styles.subAreaExpense}}>
              <Text style={styles.expenseLabel}>Expense</Text>
              <Text style={styles.expense}>{navigation.getParam('favor_expense')} €</Text>
            </View>
        </View>
        {isCandidated ? 
        <View style={styles.candidateArea}> 
                <View style={styles.subAreaAlreadyCandidated}>
                  <Text style={styles.alreadyCandidated}>Congratulations!</Text>
                  <Text style={styles.alreadyCandidated}>You are already candidated. </Text>
              </View>
        </View>
        :
        <View style={styles.candidateArea}>
              <TouchableOpacity style={{...globalStyles.customBtn, ...styles.candidateButton}} onPress={pressHandler}>
                    <Text style={globalStyles.customBtnText}>CANDIDATE</Text>
                </TouchableOpacity>          
              <View style={styles.subAreaDeadline}>
                <Text style={styles.deadlineLabel}>*Application Deadline</Text>
                <Text style={styles.deadline}>{navigation.getParam('application_deadline').toUTCString()} </Text>
            </View>
        </View>
        }
    </View>
    )
}

const styles = StyleSheet.create({
  titlePostDetails: {
    padding: 10,
    paddingLeft:13,
    fontWeight: 'bold',
    borderColor: '#ff87d7',
    borderWidth: 5,
    borderRadius: 10,
    color: 'white',
    fontSize: 22,
  },
  descPostDetails: {
    padding: 10,
    color: 'white',
    fontSize: 18,
  },
  otherInfoArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoSubArea: {
    flex:1,
    alignItems: 'flex-start',
    marginLeft:5,
    borderRadius: 10,
    padding:10,
  },
  subAreaReward: {
    borderColor: '#228B22',
    borderWidth: 5,
    backgroundColor: '#90EE90',
  },
  subAreaExpense: {
    borderColor: '#1E90FF',
    borderWidth: 5,
    backgroundColor: '#87CEFA',
  },
  rewardLabel: {
    fontSize:20,
    fontWeight: 'bold',
    color: '#228B22',
  },
  expenseLabel: {
    fontSize:20,
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  reward: {
    fontSize:18,
    color: 'black',
  },
  expense: {
    fontSize:18,
    color: 'black',
  },
  candidateArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft:5,
    marginTop:30,
  },
  subAreaDeadline:{
    marginLeft: 10,
    flex:1,
  },
  deadlineLabel: {
    color: '#DC143C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deadline: {
    color: '#DC143C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  candidateButton: {
    flex:1,
    marginTop:5,
  },
  alreadyCandidated: {
    fontSize:20,
    fontWeight: 'bold',
    color: '#7CFC00',
  }
});
