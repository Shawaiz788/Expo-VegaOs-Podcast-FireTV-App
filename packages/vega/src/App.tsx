import { ImageBackground } from 'react-native';
import { enableFreeze, enableScreens } from '@amazon-devices/react-native-screens';
import { createNativeStackNavigator } from '@amazon-devices/react-navigation__native-stack';
import { NavigationContainer } from '@amazon-devices/react-navigation__native';
import { HomeScreen, PodcastDetailScreen } from '@multitv/shared';
import React from 'react';



enableScreens();
enableFreeze();

const Stack = createNativeStackNavigator();

function HomeScreenWrapper({ navigation }: { navigation: any }) {
  return (
    <HomeScreen
      onPodcastPress={(id: string) => navigation.navigate('PodcastDetail', { id })}
    />
  );
}


function PodcastDetailWrapper({ route }: { route: any }) {
  return <PodcastDetailScreen id={route.params.id} />;
}

export const App = () => {
  return (
    <NavigationContainer>
      <ImageBackground source={require('./assets/background.png')} style={{ flex: 1 }}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Home" component={HomeScreenWrapper} />
          <Stack.Screen name="PodcastDetail" component={PodcastDetailWrapper} />
        </Stack.Navigator>
      </ImageBackground>
    </NavigationContainer>
  );
};

