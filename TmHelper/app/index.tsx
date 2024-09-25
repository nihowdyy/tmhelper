// Index.tsx

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TMListScreen from './screens/TmListScreen';
import TMDetailScreen from './screens/TmDetailScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="TMList">
        <Stack.Screen 
          name="TMList" 
          component={TMListScreen} 
          options={{ title: 'Technical Machines', headerTitleStyle: { fontWeight: 'bold' } }} 
        />
        <Stack.Screen 
          name="TMDetails" 
          component={TMDetailScreen} 
          options={{ title: 'TM Details', headerTitleStyle: { fontWeight: 'bold' } }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
