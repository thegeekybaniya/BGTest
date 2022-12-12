import { StyleSheet, Text, useWindowDimensions, View, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect } from 'react'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  runOnUI,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

export default function SwipeModal({ openingDirection = 'up', children, coveragePercent = 80, isVisible, onClose }) {
  const dimensions = useWindowDimensions()
  const isClosedModal = useSharedValue(false)
  const modalTop = useSharedValue(dimensions.height)
  const modalBottom = useSharedValue(dimensions.height)
  const modalLeft = useSharedValue(dimensions.width)
  const modalRight = useSharedValue(dimensions.width)
  const backdropTop = useSharedValue(dimensions.height)
  const backdropBottom = useSharedValue(dimensions.height)
  const backdropLeft = useSharedValue(dimensions.width)
  const backdropRight = useSharedValue(dimensions.width)

  const MAX_HEIGHT = (dimensions.height * coveragePercent) / 100
  const MAX_WIDTH = (dimensions.width * coveragePercent) / 100
  const style = useAnimatedStyle(() => {
    switch (openingDirection) {
      case 'up':
        return { top: modalTop.value, height: MAX_HEIGHT }
      case 'down':
        return { bottom: modalBottom.value, height: MAX_HEIGHT }
      case 'left':
        return { left: modalLeft.value, width: MAX_WIDTH }
      case 'right':
        return { right: modalRight.value, width: MAX_WIDTH }
    }
  }, [openingDirection])
  const backdropStyle = useAnimatedStyle(() => {
    switch (openingDirection) {
      case 'up':
        return { top: backdropTop.value, left: 0, right: 0 }
      case 'down':
        return { bottom: backdropBottom.value, left: 0, right: 0 }
      case 'left':
        return { left: backdropLeft.value, top: 0, bottom: 0 }
      case 'right':
        return { right: backdropRight.value, top: 0, bottom: 0 }
    }
  }, [openingDirection])
  const gestureHandler = useAnimatedGestureHandler(
    {
      onStart(_, context) {
        switch (openingDirection) {
          case 'up':
            context.startTop = modalTop.value
            break
          case 'down':
            context.startBottom = modalBottom.value
            break
          case 'left':
            context.startLeft = modalLeft.value
            break
          case 'right':
            context.startRight = modalRight.value
            break

          default:
            break
        }
        context.isModalClosed = false
      },
      onActive(event, context) {
        //   top.value = context.startTop + event.translationY

        switch (openingDirection) {
          case 'up':
            modalTop.value =
              context.startTop + event.translationY < dimensions.height - MAX_HEIGHT
                ? dimensions.height - MAX_HEIGHT
                : context.startTop + event.translationY
            break
          case 'down':
            modalBottom.value =
              context.startBottom - event.translationY < dimensions.height - MAX_HEIGHT
                ? dimensions.height - MAX_HEIGHT
                : context.startBottom - event.translationY
            break
          case 'left':
            modalLeft.value =
              context.startLeft + event.translationX < dimensions.width - MAX_WIDTH
                ? dimensions.width - MAX_WIDTH
                : context.startLeft + event.translationX
            break
          case 'right':
            // console.log(
            //   'onActive',
            //   openingDirection,
            //   context.startRight - event.translationX,
            //   dimensions.width - MAX_WIDTH,
            // )
            modalRight.value =
              context.startRight - event.translationX < dimensions.width - MAX_WIDTH
                ? dimensions.width - MAX_WIDTH
                : context.startRight - event.translationX
            break
        }
      },
      onEnd(_, context) {
        switch (openingDirection) {
          case 'up':
            if (modalTop.value > dimensions.height - MAX_HEIGHT + 100) {
              modalTop.value = withSpring(dimensions.height, SPRING_CONFIG)
              backdropTop.value = withSpring(dimensions.height, SPRING_CONFIG)
              context.isModalClosed = true
            } else {
              modalTop.value = dimensions.height - MAX_HEIGHT
            }
            break
          case 'down':
            if (modalBottom.value > dimensions.height - MAX_HEIGHT + 100) {
              modalBottom.value = withSpring(dimensions.height, SPRING_CONFIG)
              backdropBottom.value = withSpring(dimensions.height, SPRING_CONFIG)
              context.isModalClosed = true
            } else {
              modalBottom.value = dimensions.height - MAX_HEIGHT
            }
            break
          case 'left':
            if (modalLeft.value > dimensions.width - MAX_WIDTH + 40) {
              modalLeft.value = withSpring(dimensions.width, SPRING_CONFIG)
              backdropLeft.value = withSpring(dimensions.width, SPRING_CONFIG)
              context.isModalClosed = true
            } else {
              modalLeft.value = dimensions.width - MAX_WIDTH
            }
            break
          case 'right':
            if (modalRight.value > dimensions.width - MAX_WIDTH + 40) {
              modalRight.value = withSpring(dimensions.width, SPRING_CONFIG)
              backdropRight.value = withSpring(dimensions.width, SPRING_CONFIG)
              context.isModalClosed = true
            } else {
              modalRight.value = dimensions.width - MAX_WIDTH
            }
            break

          default:
            break
        }
      },
      onFinish(_, context) {
        if (context.isModalClosed && onClose) {
          runOnJS(onClose)()
        }
      },
    },
    [onClose, openingDirection],
  )
  useEffect(() => {
    if (isVisible) {
      openModal()
    } else {
      closeModal()
    }
  }, [isVisible])
  useEffect(() => {
    if (isClosedModal.value == true) {
      console.log('ONCLOSE')
      if (onClose) {
        onClose()
      }
    }
  }, [isClosedModal.value])

  const openModal = () => {
    console.log('openModal', { openingDirection })
    switch (openingDirection) {
      case 'up':
        modalTop.value = withSpring(dimensions.height - MAX_HEIGHT, SPRING_CONFIG)
        backdropTop.value = withSpring(0, SPRING_CONFIG)
        break
      case 'down':
        modalBottom.value = withSpring(dimensions.height - MAX_HEIGHT, SPRING_CONFIG)
        backdropBottom.value = withSpring(0, SPRING_CONFIG)
        break
      case 'left':
        modalLeft.value = withSpring(dimensions.width - MAX_WIDTH, SPRING_CONFIG)
        backdropLeft.value = withSpring(0, SPRING_CONFIG)
        break
      case 'right':
        modalRight.value = withSpring(dimensions.width - MAX_WIDTH, SPRING_CONFIG)
        backdropRight.value = withSpring(0, SPRING_CONFIG)
        break
      default:
        break
    }
  }
  const closeModal = () => {
    switch (openingDirection) {
      case 'up':
        backdropTop.value = withSpring(dimensions.height, SPRING_CONFIG)
        break
      case 'down':
        backdropBottom.value = withSpring(dimensions.height, SPRING_CONFIG)
        break
      case 'left':
        backdropLeft.value = withSpring(dimensions.height, SPRING_CONFIG)
        break
      case 'right':
        backdropRight.value = withSpring(dimensions.height, SPRING_CONFIG)
        break

      default:
        break
    }
    if (onClose) {
      onClose()
    }
  }

  return (
    <>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={[
            {
              height: '100%',
              width: '100%',
              position: 'absolute',
              justifyContent: 'flex-end',
              backgroundColor: 'yellow',
            },
            backdropStyle,
          ]}
        >
          <TouchableWithoutFeedback style={{ flex: 1 }} onPress={closeModal}>
            <View style={{ flex: 1, backgroundColor: 'red' }} />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              {
                height: '100%',
                width: '100%',
                position: 'absolute',
                left: 0,
                right: 0,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                padding: 20,
                borderColor: 'black',
              },
              style,
            ]}
          >
            {children}
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </>
  )
}

const styles = StyleSheet.create({})

const SPRING_CONFIG = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500,
}
