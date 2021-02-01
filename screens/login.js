import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function Login({ navigation }) {

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [users, setUsers] = useState(null);


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
            navigation.navigate('Home', user);
            found = true;
          }
      }

      if (!found){
        alert('Email or Password do not match an existing user.')
      }
        
    }

    return (
      <View style={styles.container}>
        <Text style={styles.logo}>Favors</Text>
        <View style={styles.inputView} >
          <TextInput  
            style={styles.inputText}
            placeholder="Email..." 
            placeholderTextColor="#003f5c"
            onChangeText={text => setEmail({email:text})}/>
        </View>
        <View style={styles.inputView} >
          <TextInput  
            secureTextEntry
            style={styles.inputText}
            placeholder="Password..." 
            placeholderTextColor="#003f5c"
            onChangeText={text => setPassword({password:text})}/>
        </View>
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={pressLoginHandler}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.signupText}>Signup</Text>
        </TouchableOpacity>

  
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171F33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#e4d0e3",
    marginBottom:40
  },
  inputView:{
    width:"80%",
    backgroundColor:"#465881",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"#e4d0e3"
  },
  forgot:{
    color:"#e4d0e3",
    fontSize:11
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#e4d0e3",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText:{
    color:"#171F33"
  },
  signupText:{
    color:"#e4d0e3"
  }
});