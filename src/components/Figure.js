import React from 'react'
import { View, StyleSheet } from '@react-pdf/core'

const styles = StyleSheet.create({
  fullWidth: {
    width: '515',
    marginLeft: -90
  },
  columnWidth: {
    width: '100%'
  }
})

const Figure = ({ size, width, inCenter, children }) => {
  let sizeClassName

  if (width) {
    sizeClassName = { width }
  } else if (inCenter && size === 'breakout') {
    sizeClassName = styles.fullWidth
  } else {
    sizeClassName = styles.columnWidth
  }

  return <View style={sizeClassName}>{children}</View>
}

export default Figure