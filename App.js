
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createSwitchNavigator } from 'react-navigation';
import {AsyncStorage} from '@react-native-community/async-storage';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import SignUpScreen from './screens/SignUpScreen';
import UpdateUserInfoScreen from './screens/UpdateUserInfoScreen';
import CreateChitScreen from './screens/CreateChitScreen';
import FollowersScreen from './screens/FollowersScreen';
import SavedChitsScreen from './screens/SavedChitsScreen';


const homeAppsStack = createStackNavigator({
  AllChits:{
    screen: HomeScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  OtherUserProfile:{
    screen: UserProfileScreen,
    navigationOptions: {
      headerShown: false,
    }
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
  SavedChits: {
    screen: SavedChitsScreen,
    navigationOptions:{
      headerShown: false,
    },
  },
}, {
  initialRouteName:"CreateChit",
});

const userAppStack = createStackNavigator({
  UserProfile:{
    screen: MyProfileScreen,
    navigationOptions:{
      headerShown: false,
    },
  },
  UpdateUserInfo:{
    screen: UpdateUserInfoScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  Followers:{
    screen: FollowersScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  OtherUserProfile:{
    screen: UserProfileScreen,
    navigationOptions: {
      headerShown: false,
    }
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
    screen: userAppStack,
    navigationOptions: {
      headerShown: false,
    }
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
