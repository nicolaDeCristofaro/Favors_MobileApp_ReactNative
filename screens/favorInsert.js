import React, { useEffect, useState} from 'react'
import { Alert, StyleSheet, TextInput, View, TouchableOpacity, 
    TouchableWithoutFeedback, Keyboard, Text, ActivityIndicator } from 'react-native'
import { globalStyles } from '../styles/global'
import { Formik } from 'formik';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup';

const favorInsertSchema = yup.object({
    title: yup.string()
      .required('*The title field is required')
      .min(5, ({ min }) => `*Title must be at least ${min} characters`)
      .max(50, ({ max }) => `*Title must be at max ${max} characters`),
    description: yup.string()
        .required('*The description field is required')
        .min(5, ({ min }) => `*Description must be at least ${min} characters`)
        .max(1000, ({ max }) => `*Description must be at max ${max} characters`),
    favor_expense: yup.string()
        .required('*The favor_expense fiels is required'),
    reward: yup.string()
        .required('*The reward fiels is required'),
    application_deadline: yup.string()
        .required('*The application_deadline fiels is required'),
});

export default function FavorInsert( {navigation} ) {

    //State
    const [currentUser, setCurrentUser] = useState(null);
    const [titleDirty, setTitleDirty] = useState(false);
    const [descDirty, setDescDirty] = useState(false);
    const [oldDate, setOldDate] = useState(false);
    const [favorToInsert, setFavorToInsert] = useState(null);
    const [formActions, setFormActions] = useState(null);


    //Azure Client Services
    const { ContentModeratorClient } = require("@azure/cognitiveservices-contentmoderator");
    const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");
    var WindowsAzure = require('azure-mobile-apps-client');
  
    var azureMobileClient = new WindowsAzure.MobileServiceClient('https://favors-app.azurewebsites.net');
    let contentModeratorKey = 'be1c58ed1a73426eb45cebb1f26e3f89';
    let contentModeratorEndpoint = 'https://favors-post-moderator.cognitiveservices.azure.com/';

    const cognitiveServiceCredentials = new CognitiveServicesCredentials(contentModeratorKey);
    const contentModeratorClient = new ContentModeratorClient(cognitiveServiceCredentials, contentModeratorEndpoint);
    var favorsTable = azureMobileClient.getTable("Favors");

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

    function contentModeration (text){
        try {
            return contentModeratorClient.textModeration
                .screenText("text/plain", text);
          } catch (error) {
            console.error(error);
          }
    }

    async function sendKeywordsGeneratorEvent(idFavor, titleFavor, descFavor) {

        var event = '[' +
        '{ "id":"'+Math.floor(Math.random()*100000)+'" , "eventType":"favorInserted" ,  "subject": "favorsMobileApp"' +
        ' , "eventTime": "'+new Date().toUTCString()+'", ' +
        '"data": { "idFavor": "'+idFavor+'", "titleFavor": "'+titleFavor+'", "descFavor": "'+descFavor+'" } , "dataVersion": "1.0" }]';

        //console.log(event);


        const topicURL = "https://favors-topic.northeurope-1.eventgrid.azure.net/api/events"
        fetch(topicURL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'aeg-sas-key': 'FiLyHEUOu0vPvtxY98vtf0SCVYyPmnY1eFCdrJulQGk='
            },
            body: event,  
        })
        .then((response) => response.status)
        .then((status) => {
            console.log(status);
        })
        .catch((error) => {
            console.error(error);
        });
    }

    useEffect(() => {
        
        if((!descDirty) && (!titleDirty) && (favorToInsert != null) && (!oldDate)){
            //Title and Desc are clean, so you can procede to posting
            favorsTable
                .insert(favorToInsert)
                .done( function(insertedItem) {
                    //Inform the user the post is inserted
                    Alert.alert(
                        "POST INSERTED",
                        "The favor post is inserted successfully, if you don't see the keywords wait a second and refresh!.",
                        [{
                            text: 'OK',
                            onPress: () => {
                                formActions.resetForm();
                                setFavorToInsert(null);
                                sendKeywordsGeneratorEvent(insertedItem.id, insertedItem.title, insertedItem.description);
                                navigation.navigate("Home");
                            }
                        }]);
                }, function (error) {
                    console.error('Error loading data: ', error);
                });
        }

        //Inform the user that something is wrong
        if(titleDirty){
            Alert.alert(
                "BAD TITLE",
                "The favor title contains inappropriate words, try to be kinder.",
                [{
                    text: 'OK',
                    onPress: () => {
                        console.log("Bad Title");
                    }
                }]);
        }else if(descDirty){
            Alert.alert(
                "BAD DESCRIPTION",
                "The favor description contains inappropriate words, try to be kinder.",
                [{
                    text: 'OK',
                    onPress: () => {
                        console.log("Bad desc")
                    }
                }]);
        }else if(oldDate){
            Alert.alert(
                "BAD DATE",
                "The application_deadline is an old date, insert a date from tomorrow on.",
                [{
                    text: 'OK',
                    onPress: () => {
                        console.log("Bad date")
                    }
                }]);
        }
    }, [ favorToInsert]);
    
    return (
        <Formik
          initialValues={{
              title: '', 
              description: '', 
              favor_expense: '',
              reward: '',
              application_deadline: ''}}
          validationSchema={favorInsertSchema}
          validateOnBlur={true}
          onSubmit={(values, actions) => {

            setFormActions(actions);

            function moderate(){
                return Promise.all([contentModeration(values.title), contentModeration(values.description)])
              }

            //Analyze title and description with Azure Content Moderator Service
            moderate()
                .then(([responseTitle, responseDescription]) => {
                    //Both the response are available

                    values.application_deadline=new Date(values.application_deadline);
                    const today = new Date()
                    const tomorrow = new Date(today)
                    tomorrow.setDate(tomorrow.getDate() + 1)
                    if( values.application_deadline < tomorrow) setOldDate(true);
                    else setOldDate(false);

                    if( responseTitle != null && responseTitle.terms != null && responseTitle.terms.length > 0) setTitleDirty(true);
                    else setTitleDirty(false);
                    if( responseDescription != null && responseDescription.terms != null && responseDescription.terms.length > 0) setDescDirty(true);
                    else setDescDirty(false);

                    //Refine info to add the post
                    values.id=uuid.v4();
                    values.favor_expense = parseFloat(values.favor_expense);
                    values.reward = parseFloat(values.reward);
                    values.creation_date= new Date();
                    values.id_user=currentUser.id;

                    setFavorToInsert(JSON.stringify(values));
                })
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
                        value={formikProps.values.favor_expense.toString()}
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
                        value={formikProps.values.reward.toString()}
                        keyboardType='numeric'
                    />
                </View>
                <Text style={globalStyles.errorText}>{formikProps.touched.reward && formikProps.errors.reward}</Text>

                <View style={{...globalStyles.inputView,...styles.insertPostView}}>
                    <TextInput
                        style={globalStyles.inputText}
                        placeholder='Insert a dealine (mm/dd/yyyy)...'
                        placeholderTextColor="#fff"
                        onChangeText={formikProps.handleChange('application_deadline')}
                        onBlur={formikProps.handleBlur('application_deadline')} 
                        value={formikProps.values.application_deadline.toString()}
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
        height: '25%',
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }
  });