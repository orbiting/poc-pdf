import React from 'react'
import { View, StyleSheet } from '@react-pdf/core'

const styles = StyleSheet.create({
  titleblock: {
    width: 500,
    marginTop: 20,
    marginBottom: 40
  }
})

const TitleBlock = ({ children, ...props }) => (
  <View
    style={[
      styles.titleblock,
      { textAlign: props.center ? 'center' : 'left' }
    ]}
    {...props}
  >
    {children}
  </View>
)

export default TitleBlock