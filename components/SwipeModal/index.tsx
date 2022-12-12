import { StyleSheet, Text, useWindowDimensions, View, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  runOnUI,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

export default function SwipeModal({
  openingDirection = 'up',
  children,
  coveragePercent = 80,
  isVisible,
  onClose,
  enableBackOnBackdropPress = true,
  backdropStyleCustom = {},
  modalStyleCustom = {},
}) {
  const dimensions = useWindowDimensions()

  const modalAnimatedValue = useSharedValue(dimensions.height)
  const backdropAnimatedValue = useSharedValue(dimensions.height)

  const MAX_HEIGHT = useMemo(() => (dimensions.height * coveragePercent) / 100, [coveragePercent])
  const MAX_WIDTH = useMemo(() => (dimensions.width * coveragePercent) / 100, [coveragePercent])
  const HEIGHT_DIFF = useMemo(() => dimensions.height - MAX_HEIGHT, [coveragePercent, MAX_HEIGHT])
  const WIDTH_DIFF = useMemo(() => dimensions.width - MAX_WIDTH, [coveragePercent, MAX_WIDTH])

  const modalStyle = useAnimatedStyle(() => {
    switch (openingDirection) {
      case 'down':
        return { top: withSpring(modalAnimatedValue.value, SPRING_CONFIG), height: MAX_HEIGHT }
      case 'up':
        return { bottom: withSpring(modalAnimatedValue.value, SPRING_CONFIG), height: MAX_HEIGHT }
      case 'right':
        return { left: withSpring(modalAnimatedValue.value, SPRING_CONFIG), width: MAX_WIDTH }
      case 'left':
        return { right: withSpring(modalAnimatedValue.value, SPRING_CONFIG), width: MAX_WIDTH }
    }
  }, [openingDirection])
  const backdropStyle = useAnimatedStyle(() => {
    switch (openingDirection) {
      case 'down':
        return { top: withSpring(backdropAnimatedValue.value, SPRING_CONFIG), left: 0, right: 0 }
      case 'up':
        return { bottom: withSpring(backdropAnimatedValue.value, SPRING_CONFIG), left: 0, right: 0 }
      case 'right':
        return { left: withSpring(backdropAnimatedValue.value, SPRING_CONFIG), top: 0, bottom: 0 }
      case 'left':
        return { right: withSpring(backdropAnimatedValue.value, SPRING_CONFIG), top: 0, bottom: 0 }
    }
  }, [openingDirection])
  const gestureHandler = useAnimatedGestureHandler(
    {
      onStart(_, context) {
        context.startAnimatedValue = modalAnimatedValue.value
        context.isModalClosed = false
      },
      onActive(event, context) {
        switch (openingDirection) {
          case 'down':
            modalAnimatedValue.value =
              context.startAnimatedValue + event.translationY < HEIGHT_DIFF
                ? HEIGHT_DIFF
                : context.startAnimatedValue + event.translationY
            break
          case 'up':
            modalAnimatedValue.value =
              context.startAnimatedValue - event.translationY < HEIGHT_DIFF
                ? HEIGHT_DIFF
                : context.startAnimatedValue - event.translationY
            break
          case 'right':
            modalAnimatedValue.value =
              context.startAnimatedValue + event.translationX < WIDTH_DIFF
                ? WIDTH_DIFF
                : context.startAnimatedValue + event.translationX
            break
          case 'left':
            modalAnimatedValue.value =
              context.startAnimatedValue - event.translationX < WIDTH_DIFF
                ? WIDTH_DIFF
                : context.startAnimatedValue - event.translationX
            break
        }
      },
      onEnd(_, context) {
        switch (openingDirection) {
          case 'up':
          case 'down':
            if (modalAnimatedValue.value > HEIGHT_DIFF + 100) {
              modalAnimatedValue.value = withSpring(dimensions.height, SPRING_CONFIG)
              backdropAnimatedValue.value = withSpring(dimensions.height, SPRING_CONFIG)
              context.isModalClosed = true
            } else {
              modalAnimatedValue.value = HEIGHT_DIFF
            }
            break
          case 'left':
          case 'right':
            if (modalAnimatedValue.value > WIDTH_DIFF + 40) {
              modalAnimatedValue.value = withSpring(dimensions.width, SPRING_CONFIG)
              backdropAnimatedValue.value = withSpring(dimensions.width, SPRING_CONFIG)
              context.isModalClosed = true
            } else {
              modalAnimatedValue.value = WIDTH_DIFF
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

  const openModal = () => {
    switch (openingDirection) {
      case 'up':
      case 'down':
        modalAnimatedValue.value = withSpring(HEIGHT_DIFF, SPRING_CONFIG)
        backdropAnimatedValue.value = withSpring(0, SPRING_CONFIG)
        break
      case 'left':
      case 'right':
        modalAnimatedValue.value = withSpring(WIDTH_DIFF, SPRING_CONFIG)
        backdropAnimatedValue.value = withSpring(0, SPRING_CONFIG)
        break
      default:
        break
    }
  }
  const closeModal = () => {
    backdropAnimatedValue.value = withSpring(dimensions.height, SPRING_CONFIG)
    if (onClose) {
      onClose()
    }
  }
  return (
    <>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.parentViewDefaultStyle, backdropStyleCustom, backdropStyle]}>
          <TouchableWithoutFeedback
            style={styles.backdropTouchableStyle}
            onPress={closeModal}
            disabled={!enableBackOnBackdropPress}
          >
            <View style={styles.backdropViewDefaultStyle} />
          </TouchableWithoutFeedback>
          <Animated.View style={[styles.modalViewDefaultStyle, modalStyleCustom, modalStyle]}>{children}</Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </>
  )
}

const styles = StyleSheet.create({
  parentViewDefaultStyle: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  modalViewDefaultStyle: {
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
  backdropViewDefaultStyle: { flex: 1, backgroundColor: 'transparent' },
  backdropTouchableStyle: { flex: 1 },
})

const SPRING_CONFIG = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500,
}
