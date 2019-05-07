import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon } from 'react-native-elements'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'black',
    borderColor: 'transparent',
    borderRadius: 10,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 18,
    width: 34,
  },
})

const BaseIcon = ({ containerStyle, icon, color= 'white', size= 24 }) => (
  <View style={[styles.container, containerStyle]}>
    <Icon
      size={size}
      color= {color}
      type='material'
      name='notifications'
      {...icon}
    />
  </View>
)

BaseIcon.defaultProps = {
  containerStyle: {},
  icon: {},
  iconStyle: {}
}

export default BaseIcon