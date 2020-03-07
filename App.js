
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import './Global.js';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import UserProfileScreen from './screens/UserProfile';

const homeAppsStack = createStackNavigator({
  Home:{
    screen: HomeScreen
  },
  UserProfile:{
    screen: UserProfileScreen
  }
  })

const AppTabNav = createBottomTabNavigator({
  Home: {
    screen: homeAppsStack
    },
  MyProfile: {
    screen: MyProfileScreen
  }
});

const AppStackNav = createStackNavigator({
    tabs: {
      screen: AppTabNav,
      navigationOptions: {
        headerShown: false,
      }
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        headerShown:false,
      }
    }
}, {
    initialRouteName:"Login",
  });

const AppContainer = createAppContainer(AppStackNav);

export default AppContainer;
