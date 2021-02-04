import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity,
        TouchableWithoutFeedback, Keyboard } from 'react-native';
import { globalStyles } from '../styles/global';
import AsyncStorage from '@react-native-async-storage/async-storage';


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

    const pressLoginHandler = () =>  {
      var numItemsRead = users.length;
      var found = false;

      for (var i = 0 ; i < numItemsRead ; i++) {
          var user = users[i];
          if (email.email === user.email && password.password === user.password){
            storeData(user);
            navigation.navigate('Home', user);
            found = true;
          }
      }

      if (!found){
        alert('Email or Password do not match an existing user.')
      }
        
    }

    return (
      <TouchableWithoutFeedback onPress={ Keyboard.dismiss}>
        <View style={styles.containerLogin}>
          <Text style={styles.logo}>Favors</Text>
          <View style={globalStyles.inputView} >
            <TextInput  
              style={globalStyles.inputText}
              placeholder="Email..." 
              placeholderTextColor="#fff"
              onChangeText={text => setEmail({email:text})}/>
          </View>
          <View style={globalStyles.inputView} >
            <TextInput  
              secureTextEntry
              style={globalStyles.inputText}
              placeholder="Password..." 
              placeholderTextColor="#fff"
              onChangeText={text => setPassword({password:text})}/>
          </View>
          <TouchableOpacity>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={globalStyles.customBtn} onPress={pressLoginHandler}>
            <Text style={globalStyles.customBtnText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.signupText}>Signup</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
      
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