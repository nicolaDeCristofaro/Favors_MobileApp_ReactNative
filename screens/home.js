import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { globalStyles } from '../styles/global'

export default function Home({ navigation }) {

    const pressHandler = () => {
      navigation.navigate('FavorDetails');
    }
      return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.titleText}>Home page</Text>
        <Button title='Favor details' onPress={pressHandler}/>
      </View>
    )
}

const styles = StyleSheet.create({
  
});
