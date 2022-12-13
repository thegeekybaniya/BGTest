import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { View, Button } from 'react-native'
import InfiniteScrollDisplay from './screens/InfiniteScrollDisplay'
import SwipeModalDisplay from './screens/SwipeModalDisplay'

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
  return (
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
