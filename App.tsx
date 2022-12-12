import React, { useState } from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import SwipeModal from './components/SwipeModal'

const Content = () => (
  <View
    style={{
      height: '100%',
      width: '100%',
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>Modal Content 🔥 </Text>
  </View>
)

const App = () => {
  const [openTop, setOpenTop] = useState(false)
  const [openBottom, setOpenBottom] = useState(false)
  const [openLeft, setOpenLeft] = useState(false)
  const [openRight, setOpenRight] = useState(false)
  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          title="Open Top"
          onPress={() => {
            setOpenTop(!openTop)
          }}
        />
        <Button
          title="Open Bottom"
          onPress={() => {
            setOpenBottom(!openBottom)
          }}
        />
        <Button
          title="Open Left"
          onPress={() => {
            setOpenLeft(!openLeft)
          }}
        />
        <Button
          title="Open Right"
          onPress={() => {
            setOpenRight(!openRight)
          }}
        />
      </View>
      <SwipeModal
        openingDirection="up"
        coveragePercent={80}
        isVisible={openTop}
        onClose={() => {
          setOpenTop(false)
        }}
        backdropStyleCustom={styles.customBackdropStyle}
        modalStyleCustom={styles.customModalStyle}
      >
        <Content />
      </SwipeModal>
      <SwipeModal
        openingDirection="down"
        coveragePercent={80}
        isVisible={openBottom}
        onClose={() => {
          setOpenBottom(false)
        }}
        backdropStyleCustom={styles.customBackdropStyle}
        modalStyleCustom={styles.customModalStyle}
        enableBackOnBackdropPress={false}
      >
        <Content />
      </SwipeModal>
      <SwipeModal
        openingDirection="left"
        coveragePercent={80}
        isVisible={openLeft}
        onClose={() => {
          setOpenLeft(false)
        }}
        backdropStyleCustom={styles.customBackdropStyle}
        modalStyleCustom={styles.customModalStyle}
      >
        <Content />
      </SwipeModal>
      <SwipeModal
        openingDirection="right"
        coveragePercent={80}
        isVisible={openRight}
        onClose={() => {
          setOpenRight(false)
        }}
        backdropStyleCustom={styles.customBackdropStyle}
        modalStyleCustom={styles.customModalStyle}
        enableBackOnBackdropPress={false}
      >
        <Content />
      </SwipeModal>
    </>
  )
}

const styles = StyleSheet.create({
  customBackdropStyle: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
  customModalStyle: {
    backgroundColor: 'white',
  },
})
export default gestureHandlerRootHOC(App)
