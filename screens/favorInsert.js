import React, { useEffect, useState} from 'react'
import { StyleSheet, TextInput, View, TouchableOpacity, 
    TouchableWithoutFeedback, Keyboard, Text } from 'react-native'
import { globalStyles } from '../styles/global'
import { Formik } from 'formik';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup';

const favorInsertSchema = yup.object({
    title: yup.string()
      .required('*A title is required')
      .min(5)
      .max(50),
    description: yup.string()
      .required()
      .min(5)
      .max(1000),
    favor_expense: yup.string()
      .required(),
    reward: yup.string()
      .required(),
    application_deadline: yup.string()
      .required(),
  });

export default function FavorInsert( {navigation} ) {

    const [currentUser, setCurrentUser] = useState(null);

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

    useEffect(() => {
        const getData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('@user');
                if (jsonValue != null)
                    console.log(JSON.parse(jsonValue));
            } catch(e) {
                console.log(e);
            }
        }
        getData()
    }, []);
    
    return (
        <Formik
          initialValues={{
              title: '', 
              description: '', 
              favor_expense: '',
              reward: '',
              application_deadline: ''}}
          validationSchema={favorInsertSchema}
          onSubmit={(values, actions) => {
              actions.resetForm();

              values.id=3;
              values.reward = parseFloat(values.reward);
              values.favor_expense = parseFloat(values.favor_expense);
              //TO DO: resolve datetime consistency between SQL and JS
              /*values.creation_date=new Date().toString();
              console.log(values.application_deadline);
              console.log(new Date(Date.parse(values.application_deadline)));*/
              console.log(uuid.v4());
              console.log(navigation.dangerouslyGetParent().state);
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
                    onBlur={formikProps.handleBlur('title')} 
                    value={formikProps.values.title}
                />
                </View>
                <Text style={globalStyles.errorText}>{formikProps.touched.title && formikProps.errors.title}</Text>

                <View style={{...globalStyles.inputView,...styles.insertPostView, ...styles.favorDescription}}>
                    <TextInput
                        style={globalStyles.inputText}
                        multiline
                        placeholder='Insert a description...'
                        placeholderTextColor="#fff"
                        onChangeText={formikProps.handleChange('description')}
                        onBlur={formikProps.handleBlur('description')} 
                        value={formikProps.values.description}
                    />
                </View>
                <Text style={globalStyles.errorText}>{formikProps.touched.description && formikProps.errors.description}</Text>

                <View style={{...globalStyles.inputView,...styles.insertPostView}}>
                    <TextInput 
                        style={globalStyles.inputText}
                        placeholder='Insert the expense needed...'
                        placeholderTextColor="#fff"
                        onChangeText={formikProps.handleChange('favor_expense')}
                        onBlur={formikProps.handleBlur('favor_expense')} 
                        value={formikProps.values.favor_expense}
                        keyboardType='numeric'
                    />
                </View>
                <Text style={globalStyles.errorText}>{formikProps.touched.favor_expense && formikProps.errors.favor_expense}</Text>

                <View style={{...globalStyles.inputView,...styles.insertPostView}}>
                    <TextInput 
                        style={globalStyles.inputText}
                        placeholder='Insert the reward amount...'
                        placeholderTextColor="#fff"
                        onChangeText={formikProps.handleChange('reward')}
                        onBlur={formikProps.handleBlur('reward')} 
                        value={formikProps.values.reward}
                        keyboardType='numeric'
                    />
                </View>
                <Text style={globalStyles.errorText}>{formikProps.touched.reward && formikProps.errors.reward}</Text>

                <View style={{...globalStyles.inputView,...styles.insertPostView}}>
                    <TextInput
                        style={globalStyles.inputText}
                        placeholder='Insert a dealine...'
                        placeholderTextColor="#fff"
                        onChangeText={formikProps.handleChange('application_deadline')}
                        onBlur={formikProps.handleBlur('application_deadline')} 
                        value={formikProps.values.application_deadline}
                    />
                </View>
                <Text style={globalStyles.errorText}>{formikProps.touched.application_deadline && formikProps.errors.application_deadline}</Text>

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
    },
    favorDescription: {
        height: '30%',
    }
  });