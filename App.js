
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createSwitchNavigator } from 'react-navigation';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import SignUpScreen from './screens/SignUpScreen';
import UpdateUserInfoScreen from './screens/UpdateUserInfoScreen';
import CreateChitScreen from './screens/CreateChitScreen';
import FollowersScreen from './screens/FollowersScreen';


const homeAppsStack = createStackNavigator({
  AllChits:{
    screen: HomeScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  OtherUserProfile:{
    screen: UserProfileScreen
  }
},{
  initialRouteName:"AllChits",
  });

const ChitStack = createStackNavigator({
  CreateChit: {
    screen: CreateChitScreen,
    navigationOptions: {
      headerShown: false,
    },
  },

}, {
  initialRouteName:"CreateChit",
});

const userAppStack = createStackNavigator({
  UserProfile:{
    screen: MyProfileScreen
  },
  UpdateUserInfo:{
    screen: UpdateUserInfoScreen
  },
  Followers:{
    screen: FollowersScreen
  },
  OtherUserProfile:{
    screen: UserProfileScreen
  },
},{
  initialRouteName:"UserProfile",
});

const AppTabNav = createBottomTabNavigator({
  Home: {
    screen: homeAppsStack
    },
  Chit: {
    screen: ChitStack
  },
  MyProfile: {
    screen: userAppStack
  }
});

const LoginStackNav = createStackNavigator({
  Login:{
    screen: LoginScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
}, {
  initialRouteName:"Login",
});

/*const AppStackNav = createStackNavigator({
    tabs: {
      screen: AppTabNav,
      navigationOptions: {
        headerShown: false,
      }
    },
    LoginTabs: {
      screen: LoginStackNav,
      navigationOptions: {
        headerShown: false,
      }
    }
}, {
    initialRouteName:"LoginTabs",
  });*/

const AppStackNav = createSwitchNavigator({
    App: AppTabNav,
    Auth: LoginStackNav,
}, {
  initialRouteName: 'Auth',
  }
);

const AppContainer = createAppContainer(AppStackNav);

export default AppContainer;
