import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Card(props) {
  return (
    <View>
        <View style={styles.card}>
            <View style={styles.postOwner}>
                <Ionicons name={'ios-person'} size={18} />
                <Text style={{ paddingTop: 1, fontSize: 16, fontWeight: 'bold'}}> Max </Text>
            </View>
            <View style={styles.cardContent}>
                <Image
                source={require("../assets/home-cleaning.jpg")}
                style={{
                    height: 115,
                    width: '100%',
                }}
                />
                <View style={{ padding: 10, width: '100%' }}>
                    <Text style={styles.titlePost}> { props.item.title }</Text>
                    <View style={styles.keywordsArea}>
                      <Text style={styles.keyword}>
                          #keyword1
                      </Text>
                      <Text style={styles.keyword}>
                          #keyword1
                      </Text>
                    </View>
                </View>
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    elevation: 1,
    backgroundColor: '#e4d0e3',
    overflow: 'hidden',
    marginHorizontal: 1,
    marginVertical: 6,
    width: '100%',
  },
  cardContent: {
    marginVertical: 5,
  },
  postOwner: {
      flexDirection: 'row',
      padding: 10,
      paddingBottom: 5,
      fontWeight: 'bold',
  },
  titlePost: {
    fontWeight: 'bold',
    color: '#320032',
    fontSize: 16,
  },
  keywordsArea: {
    flexDirection: 'row',
    marginLeft: 5,
  },
  keyword: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'violet',
    marginRight: 5,
    padding: 1,
    borderRadius: 5,
  }
});