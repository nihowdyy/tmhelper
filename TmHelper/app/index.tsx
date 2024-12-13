// Index.tsx

import * as React from 'react';
import { NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TMListScreen from './screens/TmListScreen';
import TMDetailScreen from './screens/TmDetailScreen';
import LandingPage from './screens/LandingPage';
import Pokedex from './screens/Pokedex';
import PokeDetails from './screens/PokeDetails';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationIndependentTree>
      <Stack.Navigator initialRouteName="LandingPage">
        <Stack.Screen
          name="LandingPage"
          component={LandingPage}
          options={{ title: 'Home', headerTitleStyle: {fontWeight: 'bold'} }}
        />
        <Stack.Screen
          name="Pokedex"
          component={Pokedex}
          options={{ title: 'Pokedex', headerTitleStyle: { fontWeight: 'bold' } }} 
        />
        <Stack.Screen
          name="PokeDetails"  // Define the PokeDetails screen here
          component={PokeDetails}  // Your detailed screen component
          options={{ title: 'Pokemon Details', headerTitleStyle: { fontWeight: 'bold' } }}
        />
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
    </NavigationIndependentTree>
  );
};

export default App;
