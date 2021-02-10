import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Transition } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Login from '../screens/login';
import Home from '../screens/home';
import FavorDetails from '../screens/favorDetails';
import Search from '../screens/search';
import FavorInsert from '../screens/favorInsert';
import Account from '../screens/account';
import FavorsPublished from '../screens/favorsPublished';
import FavorCandidates from '../screens/favorCandidates';


const HomeDetailsScreens = {
  Home: {
    screen: Home,
  },
  FavorDetails: {
    screen: FavorDetails,
  },
};

const HomeDetailsStack = createStackNavigator(HomeDetailsScreens, {
  defaultNavigationOptions:{
    headerTransparent: true,
    headerTitleAlign: 'center',
    headerTintColor: 'white',
  },
});

const InsertScreens = {
  'Insert Favor Post': {
    screen: FavorInsert
  },
};

const InsertStack = createStackNavigator(InsertScreens, {
  defaultNavigationOptions:{
    headerTransparent: true,
    headerTitleAlign: 'center',
    headerTintColor: 'white',
  },
});


const AccountScreens = {
  'My Account': {
    screen: Account
  },
  'Favors Published': {
    screen: FavorsPublished
  },
  'Favor Candidates': {
    screen: FavorCandidates
  },
};

const AccountStack = createStackNavigator(AccountScreens, {
  defaultNavigationOptions:{
    headerTransparent: true,
    headerTitleAlign: 'center',
    headerTintColor: 'white',
  },
});

const SearchScreens = {
  'Search': {
    screen: Search
  },
  'FavorsDetails': {
    screen: FavorDetails
  }
};

const SearchStack = createStackNavigator(SearchScreens, {
  defaultNavigationOptions:{
    headerTransparent: true,
    headerTitleAlign: 'center',
    headerTintColor: 'white',
  },
});

const TabScreens = {
  Home: {
    screen: HomeDetailsStack,
  },
  Search: {
    screen: SearchStack,
  },
  FavorInsert: {
    screen: InsertStack,
  },
  Account: {
    screen: AccountStack,
  },
};

const AuthScreens = {
    Login: {
      screen: Login,
    },
  };


const AuthStack = createStackNavigator(AuthScreens, {
    headerMode: 'none',
});

const TabNavigator = createBottomTabNavigator(TabScreens, {
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let IconComponent = Ionicons;
      let iconName;
      if (routeName === 'Home') {
        iconName = focused
          ? 'ios-home'
          : 'ios-home-outline';
      } else if (routeName === 'Search') {
        iconName = focused 
        ? 'ios-search' 
        : 'ios-search-outline';
      } else if (routeName === 'FavorInsert') {
        iconName = focused 
        ? 'ios-add' 
        : 'ios-add-outline';
      } else if (routeName === 'Account') {
        iconName = focused 
        ? 'ios-person' 
        : 'ios-person-outline';
      }

      // You can return any component that you like here!
      return <IconComponent name={iconName} size={30} color={tintColor} />;
    },
  }),
  tabBarOptions: {
      showLabel: false, // hide labels
      activeTintColor: '#F8F8F8', // active icon color
      inactiveTintColor: '#586589',  // inactive icon color
      style: {
          backgroundColor: '#171F33', // TabBar background
          borderTopColor: '#171F33',
      }
  },
});

export default createAppContainer(
    createAnimatedSwitchNavigator(
        {
            Auth: AuthStack,
            Tab: TabNavigator,
        },
        {
            initialRouteName: 'Auth',
            transition: (
              <Transition.Together>
                <Transition.Out
                  type="slide-left"
                  durationMs={400}
                  interpolation="easeIn"
                />
                <Transition.In type="fade" durationMs={500} />
              </Transition.Together>
            ),
        }
    )
);