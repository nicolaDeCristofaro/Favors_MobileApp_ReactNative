import React from 'react'
import { StyleSheet, TextInput, View, TouchableOpacity, 
    TouchableWithoutFeedback, Keyboard, Text } from 'react-native'
import { globalStyles } from '../styles/global'
import { Formik } from 'formik';
import uuid from 'react-native-uuid';

export default function FavorInsert() {

    const { ContentModeratorClient } = require("@azure/cognitiveservices-contentmoderator");
    const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");
    var WindowsAzure = require('azure-mobile-apps-client');
  
    var azureMobileClient = new WindowsAzure.MobileServiceClient('https://favors-app.azurewebsites.net');
    let contentModeratorKey = 'be1c58ed1a73426eb45cebb1f26e3f89';
    let contentModeratorEndpoint = 'https://favors-post-moderator.cognitiveservices.azure.com/';

    const cognitiveServiceCredentials = new CognitiveServicesCredentials(contentModeratorKey);
    const contentModeratorClient = new ContentModeratorClient(cognitiveServiceCredentials, contentModeratorEndpoint);
    var favorsTable = azureMobileClient.getTable("Favors");

    function success(insertedItem) {
        var id = insertedItem.id;
    }
    
    function failure(error) {
        throw new Error('Error loading data: ', error);
    }
    
    return (
        <Formik
          initialValues={{
              title: '', 
              description: '', 
              favor_expense: '',
              reward: '',
              application_deadline: ''}}
          onSubmit={(values) => {
              
              values.id=3;
              values.reward = parseFloat(values.reward);
              values.favor_expense = parseFloat(values.favor_expense);
              //TO DO: resolve datetime consistency between SQL and JS
              /*values.creation_date=new Date().toString();
              console.log(values.application_deadline);
              console.log(new Date(Date.parse(values.application_deadline)));*/
              console.log(uuid.v4());
              values.id_user=2;

            /*favorsTable
                .insert(JSON.stringify(values))
                .done( function(insertedItem) {
                    var id = insertedItem.id;
                }, failure);*/

            /*contentModeratorClient.textModeration
                .screenText("text/plain", "A Random fucking text")
                .then( (result) => {
                    console.log("The result is: ");
                    console.log(result);
                })
                .catch( (err) => {
                    console.log("An error occurred:");
                    console.error(err);
                })*/
          }}
        >
          {formikProps => (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={globalStyles.container}>
                <View style={{...globalStyles.inputView,...styles.insertPostView}}>
                    <TextInput
                    style={globalStyles.inputText}
                    placeholder='Insert a title...'
                    placeholderTextColor="#fff"
                    onChangeText={formikProps.handleChange('title')}
                    value={formikProps.values.title}
                />
                </View>

                <View style={{...globalStyles.inputView,...styles.insertPostView}}>
                    <TextInput
                        style={globalStyles.inputText}
                        multiline
                        placeholder='Insert a description...'
                        placeholderTextColor="#fff"
                        onChangeText={formikProps.handleChange('description')}
                        value={formikProps.values.description}
                    />
                </View>
                <View style={{...globalStyles.inputView,...styles.insertPostView}}>
                    <TextInput 
                        style={globalStyles.inputText}
                        placeholder='Insert the expense needed...'
                        placeholderTextColor="#fff"
                        onChangeText={formikProps.handleChange('favor_expense')}
                        value={formikProps.values.favor_expense}
                        keyboardType='numeric'
                    />
                </View>
                <View style={{...globalStyles.inputView,...styles.insertPostView}}>
                    <TextInput 
                        style={globalStyles.inputText}
                        placeholder='Insert the reward amount...'
                        placeholderTextColor="#fff"
                        onChangeText={formikProps.handleChange('reward')}
                        value={formikProps.values.reward}
                        keyboardType='numeric'
                    />
                </View>
                <View style={{...globalStyles.inputView,...styles.insertPostView}}>
                    <TextInput
                        style={globalStyles.inputText}
                        placeholder='Insert a dealine...'
                        placeholderTextColor="#fff"
                        onChangeText={formikProps.handleChange('application_deadline')}
                        value={formikProps.values.application_deadline}
                    />
                </View>
                <TouchableOpacity style={{...globalStyles.customBtn, ...styles.insertBtn}} onPress={formikProps.handleSubmit}>
                    <Text style={globalStyles.customBtnText}>INSERT</Text>
                </TouchableOpacity>
            </View>
            </TouchableWithoutFeedback>

          )}
        </Formik>
    );
  }

  const styles = StyleSheet.create({
    insertPostView: {
        width:"100%",
    },
    insertBtn: {
        marginLeft: '10%',
    }
  });