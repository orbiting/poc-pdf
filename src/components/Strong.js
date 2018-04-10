import React from 'react'
import { Link, StyleSheet } from '@react-pdf/core'
import { fontFamilies } from '../lib/fonts'

const styles = StyleSheet.create({
  strong: {
    color: '#000',
    fontSize: 13,
    fontFamily: fontFamilies.serifBold,
    textDecoration: 'none'
  }
})

// react-pdf's Text expects canonical inline children with a render() method,
// so let's abuse Link for now. We should eventually use some generic
// react-pdf compatible inline element.
const Strong = ({ children }) => (
  <Link style={styles.strong}>{children}</Link>
)

export default Strong