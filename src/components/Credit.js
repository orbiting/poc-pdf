import React from 'react'
import { Text, StyleSheet } from '@react-pdf/core'
import { fontFamilies } from '../lib/fonts'

const styles = StyleSheet.create({
  credit: {
    fontSize: 12,
    fontFamily: fontFamilies.sansSerifRegular
  }
})

const Credit = ({ children }) => (
  <Text style={styles.credit}>{children}</Text>
)

export default Credit