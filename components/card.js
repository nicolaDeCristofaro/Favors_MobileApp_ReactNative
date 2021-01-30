import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Card(props) {
  return (
    <View style={styles.cardContainer}>
        <View style={styles.postOwner}>
            <Ionicons name={'ios-person'} size={18} />
            <Text style={{ paddingTop: 1, fontSize: 16, fontWeight: 'bold'}}> Max </Text>
        </View>
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <Image
                source={require("../assets/home-cleaning.jpg")}
                style={{
                    height: 115,
                    width: '100%',
                    borderRadius: 15,
                }}
                />
                <View style={{ padding: 10, width: 280 }}>
                    <Text>Title</Text>
                    <Text style={{ color: "#777", paddingTop: 5 }}>
                        Description of the image
                    </Text>
                </View>
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
  },
  card: {
    borderRadius: 15,
    elevation: 1,
    backgroundColor: '#eee',
    overflow: 'hidden',
    marginHorizontal: 2,
    marginVertical: 6,
  },
  cardContent: {
    marginHorizontal: 15,
    marginVertical: 20,
  },
  postOwner: {
      flexDirection: 'row',
      marginLeft: 5,
      padding: 5,
      fontWeight: 'bold',
  }
});