import React, { useCallback, useMemo, useRef, useState } from 'react'
import { View, Text, StyleSheet, Button, useWindowDimensions } from 'react-native'
import { gestureHandlerRootHOC, PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import SwipeModal from './components/SwipeModal'

const SPRING_CONFIG = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500,
}

const App = () => {
  const [open, setOpen] = useState(false)
  const dimensions = useWindowDimensions()
  const bottom = useSharedValue(dimensions.height)
  const style = useAnimatedStyle(() => {
    return {
      bottom: bottom.value,
    }
  })
  const gestureHandler = useAnimatedGestureHandler({
    onStart(_, context) {
      context.startBottom = bottom.value
    },
    onActive(event, context) {
      bottom.value = context.startBottom - event.translationY
    },
    onEnd() {
      if (bottom.value > dimensions.height / 2 - 200) {
        bottom.value = dimensions.height
      } else {
        bottom.value = dimensions.height / 2
      }
    },
  })
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
          title="Open Sheet"
          onPress={() => {
            // if (!open) {
            //   bottom.value = withSpring(dimensions.height / 2, SPRING_CONFIG)
            // } else {
            //   bottom.value = withSpring(dimensions.height, SPRING_CONFIG)
            // }
            // setOpen(!open)

            setOpen(!open)
          }}
        />
      </View>
      <SwipeModal openingDirection='right' coveragePercent={80} isVisible={open} onClose={()=>{setOpen(false)}}>
        <View
          style={{ height: '100%', backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
        >
          <Text>AWESOME</Text>
        </View>
      </SwipeModal>
      {/* <PanGestureHandler onGestureEvent={gestureHandler}>
        
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              padding: 20,
              justifyContent: 'center',
              alignItems: 'center',
            },
            style,
          ]}
        >
          <Text>Sheet</Text>
        </Animated.View>
      </PanGestureHandler> */}
    </>
  )
}

export default gestureHandlerRootHOC(App)
