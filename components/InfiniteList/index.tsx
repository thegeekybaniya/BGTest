import React, {  } from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  withDecay,
  withSpring,
} from 'react-native-reanimated'
import Page from '../Page'

// Shortcomings
// 1- Animation logic could have been improved
// 2- more controls could have been added

const InfiniteList = ({ data }: { data: Array<Object> }) => {
  const { width } = useWindowDimensions()
  const translateX = useSharedValue(0)
  const panGestureEvent = useAnimatedGestureHandler(
    {
      onStart(_, context) {
        context.x = translateX.value
      },
      onActive(event, context) {
        translateX.value = event.translationX + context.x
      },
      onEnd(event) {
        translateX.value = withDecay({ velocity: event.velocityX })
        if (translateX.value > 50) {
          translateX.value = withSpring(width * (data.length - 1) * -1)
        }
        if ((data.length - 1) * width + translateX.value < 0) {
          translateX.value = withSpring(0)
        }
      },
    },
    [data],
  )
  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={{ flex: 1, flexDirection: 'row' }}>
          {data.map((_, index, tabs) => {
            return <Page key={index.toString()} index={index} translateX={translateX} length={tabs.length} />
          })}
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}

export default InfiniteList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})
