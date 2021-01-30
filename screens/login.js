import React from 'react'
import { StyleSheet, Text, View, Button} from 'react-native'
import { globalStyles } from '../styles/global'

export default function Login({ navigation }) {

    const pressHandler = () => {
      navigation.navigate('Home');
    }

    return (
    <View style={globalStyles.container}>
        <Text style={globalStyles.titleText}>Login page</Text>
        <Button title='Sign in' onPress={pressHandler}/>
      </View>
    )
}

const styles = StyleSheet.create({
  
});
