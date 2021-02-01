import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { globalStyles } from '../styles/global'

export default function FavorDetails({ navigation }) {

    const pressHandler = () => {
      navigation.goBack();
    }

    return (
    <View style={globalStyles.container}>
        <Text style={globalStyles.titleText}>Favor Details page</Text>
        <Text> {navigation.getParam('title')} </Text>
        <Button title='Back to Home' onPress={pressHandler} />
      </View>
    )
}

const styles = StyleSheet.create({
  
});
