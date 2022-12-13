import React, {  } from 'react'
import { StyleSheet, View } from 'react-native'
import InfiniteList from '../components/InfiniteList'

const list = [{}, {}, {}]
function InfiniteScrollDisplay() {
  return (
    <View style={styles.container}>
      <InfiniteList data={list} />
    </View>
  )
}

export default InfiniteScrollDisplay

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#fff',
  },
})
