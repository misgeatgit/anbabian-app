import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator
} from 'react-navigation';

// modal routes (dynamic transitions)
import ModalRoutes from './ModalRoutes';

// navigation
import TabNavigation from './TabNavigation';

// screens
import ModalMusicPlayer from '../screens/ModalMusicPlayer';
import ModalMoreOptions from '../screens/ModalMoreOptions';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

const StackNavigator = createStackNavigator(
  {
    // Main Tab Navigation
    // /////////////////////////////////////////////////////////////////////////
    TabNavigation,

    // Modals
    // /////////////////////////////////////////////////////////////////////////
    ModalMusicPlayer: {
      screen: ModalMusicPlayer,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    ModalMoreOptions: {
      screen: ModalMoreOptions,
      navigationOptions: {
        gesturesEnabled: false
      }
    }
  },
  {
    headerMode: 'none',
    initialRouteName: 'TabNavigation',
    mode: 'modal',
    transitionConfig: ModalRoutes,
    transparentCard: true
  }
);

const AuthStack = createStackNavigator(
  {
    SignIn: SignInScreen,
    SignUp: SignUpScreen
  },
  {
    initialRouteName: 'SignIn',
    headerMode: 'none'
  }
);

const App = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: StackNavigator,
      Auth: AuthStack
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);

export default App;
