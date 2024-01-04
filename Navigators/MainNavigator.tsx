import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";
import AlmacenadoScreen from '../screens/AlmacenadoSreen';
import ApiScreen from '../screens/Api';
import InterfazScreen from '../screens/InterfazSreen';
import RegistroScreen from '../screens/ResgistroScreen';
import WelcomeScreen from '../screens/WelcomeSrenn';
import Api from '../screens/Api';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Registro" component={RegistroScreen} />
      <Tab.Screen name="Stored" component={AlmacenadoScreen} />
      <Tab.Screen name="Interfaz" component={InterfazScreen} />
      <Tab.Screen name="API" component={Api} />
  
      
    </Tab.Navigator>
    
    

  );
}

function MyStack() {
  return (
    <Stack.Navigator initialRouteName='Welcome'>
      <Stack.Screen name="Tabs" component={MyTabs} />
      <Stack.Screen name="Welcome" component={WelcomeScreen}/> 
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}