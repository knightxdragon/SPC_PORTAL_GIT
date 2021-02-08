import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import { GlobalContext } from './components/GlobalContext';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import useLinking from './navigation/useLinking';
import DangNhapScreen from './screens/DangNhapScreen';
import Session from './components/Session';

import { Root } from 'native-base';

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);
  const [profile, setProfile] = React.useState(null);
  const defaultContext = {
    profile, setProfile
  }

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
        SplashScreen.preventAutoHideAsync();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        Session.getUserInfo().then((goals) => {
          if (goals != null) {
            setProfile(goals.UserId);
          }

          setLoadingComplete(true);
          SplashScreen.hideAsync();
        });
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {

    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <IconRegistry icons={EvaIconsPack} />
        <GlobalContext.Provider value={defaultContext}>
          <Root>
            <View style={styles.container}>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
                <Stack.Navigator>
                  {
                    profile == null ?
                      (
                        <Stack.Screen name="Login" component={DangNhapScreen} options={{ headerShown: false }} />
                      ) :
                      (
                        <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
                      )
                  }
                </Stack.Navigator>
              </NavigationContainer>
            </View>
          </Root>
        </GlobalContext.Provider>
      </ApplicationProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
