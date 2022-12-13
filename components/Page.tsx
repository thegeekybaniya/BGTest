import { View, Text, StyleSheet, useWindowDimensions } from 'react-native'
import React from 'react'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'

const Page = ({ index, translateX }: { index: number; translateX: Animated.SharedValue<number> }) => {
  const { width } = useWindowDimensions()
  const pageOffSet = width * index
  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value + pageOffSet }],
    }
  })
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        { flex: 1, backgroundColor: `rgba(0,0,256,0.${index + 2})`, justifyContent: 'center', alignItems: 'center' },
        rStyle,
      ]}
    >
      <Text style={{ fontSize: 30 }}>{index}</Text>
    </Animated.View>
  )
}

export default Page
