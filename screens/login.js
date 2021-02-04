import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity,
        TouchableWithoutFeedback, Keyboard } from 'react-native';
import { globalStyles } from '../styles/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as yup from 'yup';

const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('*Please enter a valid email')
    .required('*Email Address is required'),
  password: yup
    .string()
    .min(4, ({ min }) => `*Password must be at least ${min} characters`)
    .required('*Password is required'),
})


export default function Login({ navigation }) {

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [users, setUsers] = useState(null);

    const storeData = async (value) => {
      try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('@user', jsonValue)
      } catch (e) {
        console.log(e);
      }
    }

    var WindowsAzure = require('azure-mobile-apps-client');

    // Create a reference to the Azure App Service
    var client = new WindowsAzure.MobileServiceClient('https://favors-app.azurewebsites.net');

    var usersTable = client.getTable("Users");

    function success(results) {
      setUsers(results);
    }

    function failure(error) {
      throw new Error('Error loading data: ', error);
    }

    useEffect(() => {
      usersTable
        .read()
        .then(success, failure)
    }, []);

    return (
      <Formik
          initialValues={{
              email: '', 
              password: ''}}
          validationSchema={loginValidationSchema}
          onSubmit={(values, actions) => {
              actions.resetForm();

              var numItemsRead = users.length;
              var found = false;
          
              for (var i = 0 ; i < numItemsRead ; i++) {
                  var user = users[i];
                  if (values.email === user.email && values.password === user.password){
                    storeData(user);
                    navigation.navigate('Home', user);
                    found = true;
                  }
              }
          
              if (!found){
                alert('Email or Password do not match an existing user.')
              }
                  
          }}
        >
          {formikProps => (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.containerLogin}>
              <Text style={styles.logo}>Favors</Text>
                <View style={{...globalStyles.inputView,...styles.insertPostView}}>
                    <TextInput
                    style={globalStyles.inputText}
                    placeholder='Insert your email...'
                    placeholderTextColor="#fff"
                    onChangeText={formikProps.handleChange('email')}
                    onBlur={formikProps.handleBlur('email')} 
                    value={formikProps.values.email}
                    />
                </View>
                <Text style={globalStyles.errorText}>{formikProps.touched.email && formikProps.errors.email}</Text>

                <View style={{...globalStyles.inputView,...styles.insertPostView}}>
                    <TextInput
                      style={globalStyles.inputText}
                      placeholder='Insert your password...'
                      placeholderTextColor="#fff"
                      onChangeText={formikProps.handleChange('password')}
                      onBlur={formikProps.handleBlur('password')} 
                      value={formikProps.values.password}
                    />
                </View>
                <Text style={globalStyles.errorText}>{formikProps.touched.password && formikProps.errors.password}</Text>


                <TouchableOpacity style={globalStyles.customBtn} onPress={formikProps.handleSubmit}>
                    <Text style={globalStyles.customBtnText}>LOGIN</Text>
                </TouchableOpacity>
            </View>
            </TouchableWithoutFeedback>

          )}
        </Formik>
    );
}

const styles = StyleSheet.create({
  containerLogin: {
    flex: 1,
    backgroundColor: '#171F33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#ff87d7",
    marginBottom:40
  },
  forgot:{
    color:"white",
    fontSize:11
  },
  signupText:{
    color:"white"
  }
});