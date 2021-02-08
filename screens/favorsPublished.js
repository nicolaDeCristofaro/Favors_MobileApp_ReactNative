import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { globalStyles } from '../styles/global'

export default function FavorsPublished({ navigation }) {


    return (
    <View style={globalStyles.container}>
        <Text >FavorsPublished</Text>
        <Text >{navigation.getParam('id')}</Text>

      </View>
    )
}

const styles = StyleSheet.create({
  
});