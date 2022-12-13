import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, Text, Button, StyleSheet, FlatList, useWindowDimensions, StatusBar, Animated } from 'react-native'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import HomeCarousel from './components/HomeCarousel'
import InfiniteScrollDisplay from './screens/InfiniteScrollDisplay'
import SwipeModalDisplay from './screens/SwipeModalDisplay'

function getColor() {
  // generates random pastel color
  return 'hsl(' + 360 * Math.random() + ',' + (25 + 70 * Math.random()) + '%,' + (85 + 10 * Math.random()) + '%)'
}

function HomeScreen({ navigation }: { navigation: any }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Swipe Modals"
        onPress={() => {
          navigation.navigate('Swipe Modals')
        }}
      />
      <Button
        title="Infinite Scroll"
        onPress={() => {
          navigation.navigate('Infinite Scroll')
        }}
      />
    </View>
  )
}

const Stack = createNativeStackNavigator()

const App = () => {
  // const { height, width } = useWindowDimensions()
  // const flatlistElement = useRef()
  // const [tabs, setTabs] = useState([getColor(), getColor()])

  // const addTab = useCallback(() => {
  //   setTabs([...tabs, getColor()])
  // }, [tabs])
  // const getWrappableData = () => {
  //   console.log([tabs[tabs.length - 1], ...tabs, tabs[0]])
  //   return [tabs[tabs.length - 1], ...tabs, tabs[0]]
  // }

  return (
    // <View style={{ flex: 1, justifyContent: 'space-around', marginTop: StatusBar.currentHeight }}>
    //   <Button onPress={addTab} title="Add Tab" />
    //   <Text>Total {tabs.length} Tabs</Text>
    //   <View style={{ flex: 1 }}>
    //     <HomeCarousel data={tabs} />
    //   </View>
    // </View>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home Ground">
        <Stack.Screen name="Home Ground" component={HomeScreen} />
        <Stack.Screen name="Swipe Modals" component={SwipeModalDisplay} />
        <Stack.Screen name="Infinite Scroll" component={InfiniteScrollDisplay} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
