import React from 'react'
import { StyleSheet, TextInput, View, TouchableOpacity, 
    TouchableWithoutFeedback, Keyboard, Text } from 'react-native'
import { globalStyles } from '../styles/global'
import { Formik } from 'formik';

export default function FavorInsert() {

    const { ContentModeratorClient } = require("@azure/cognitiveservices-contentmoderator");
    const { CognitiveServicesCredentials } = require("@azure/ms-rest-azure-js");

    let contentModeratorKey = 'be1c58ed1a73426eb45cebb1f26e3f89';
    let contentModeratorEndpoint = 'https://favors-post-moderator.cognitiveservices.azure.com/';

    const cognitiveServiceCredentials = new CognitiveServicesCredentials(contentModeratorKey);
    const contentModeratorClient = new ContentModeratorClient(cognitiveServiceCredentials, contentModeratorEndpoint);

    return (
        <Formik
          initialValues={{ 
              title: '', 
              description: '', 
              expense: '',
              reward: '',
              deadline: '' }}
          onSubmit={(values) => {
            console.log(values);

            contentModeratorClient.textModeration
                .screenText("text/plain", "A Random fucking text")
                .then( (result) => {
                    console.log("The result is: ");
                    console.log(result);
                })
                .catch( (err) => {
                    console.log("An error occurred:");
                    console.error(err);
                })
          }}
        >
          {formikProps => (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{...globalStyles.container, ...styles.insertContainer}}>
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
                        onChangeText={formikProps.handleChange('expense')}
                        value={formikProps.values.expense}
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
                        onChangeText={formikProps.handleChange('deadline')}
                        value={formikProps.values.deadline}
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
    insertContainer: {
      alignItems: 'flex-start',
    },
    insertPostView: {
        width:"100%",
    },
    insertBtn: {
        marginLeft: '10%',
    }
  });