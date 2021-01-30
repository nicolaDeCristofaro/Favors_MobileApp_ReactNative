import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { Transition } from 'react-native-reanimated';
import Login from '../screens/login';
import Home from '../screens/home';
import FavorDetails from '../screens/favorDetails';

const AppScreens = {
  Home: {
    screen: Home,
  },
  FavorDetails: {
    screen: FavorDetails,
  },
};

const AuthScreens = {
    Login: {
      screen: Login,
    },
  };

const AppStack = createStackNavigator(AppScreens, {headerMode: 'none'});
const AuthStack = createStackNavigator(AuthScreens, {headerMode: 'none'});

export default createAppContainer(
    createAnimatedSwitchNavigator(
        {
            Auth: AuthStack,
            App: AppStack,
        },
        {
            initialRouteName: 'Auth',
            transition: (
              <Transition.Together>
                <Transition.Out
                  type="slide-right"
                  durationMs={400}
                  interpolation="easeIn"
                />
                <Transition.In type="fade" durationMs={500} />
              </Transition.Together>
            ),
        }
    )
);