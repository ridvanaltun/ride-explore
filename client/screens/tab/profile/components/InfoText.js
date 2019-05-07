import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: '#F4F5F4',
  },
  infoText: {
    fontSize: 16,
    marginLeft: 20,
    color: 'gray',
    fontWeight: '500',
  },
})
const InfoText = ({ text }) => (
  <View style={styles.container}>
    <Text style={styles.infoText}>{text}</Text>
  </View>
)

export default InfoText