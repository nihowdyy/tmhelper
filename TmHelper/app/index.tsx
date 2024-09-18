// App.tsx

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TMListScreen from './screens/TmListScreen';
import TMDetailScreen from './screens/TmDetailScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer independent = {true}>
      <Stack.Navigator initialRouteName="TMList">
        <Stack.Screen name="TMList" component={TMListScreen} />
        <Stack.Screen name="TMDetail" component={TMDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
