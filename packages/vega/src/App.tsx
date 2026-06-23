import { ImageBackground } from 'react-native';
import { enableFreeze, enableScreens } from '@amazon-devices/react-native-screens';
import { createNativeStackNavigator } from '@amazon-devices/react-navigation__native-stack';
import { NavigationContainer } from '@amazon-devices/react-navigation__native';
import {HomeScreen, PodcastDetailScreen, PodcastIndexProvider, digestSHA1} from '@multitv/shared';
import React from 'react';
import {PlayerScreen} from './screens/PlayerScreen';



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


function PodcastDetailWrapper({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  return (
    <PodcastDetailScreen
      id={route.params.id}
      onEpisodePress={(episodeId: number) =>
        navigation.navigate('Player', {episodeId})
      }
    />
  );
}

function PlayerScreenWrapper({route}: {route: any}) {
  return <PlayerScreen episodeId={route.params.episodeId} />;
}

export const App = () => {
  return (
    <NavigationContainer>
      <PodcastIndexProvider digestSHA1={digestSHA1}>
        <ImageBackground source={require('./assets/background.png')} style={{ flex: 1 }}>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="Home" component={HomeScreenWrapper} />
            <Stack.Screen name="PodcastDetail" component={PodcastDetailWrapper} />
            <Stack.Screen name="Player" component={PlayerScreenWrapper} />
          </Stack.Navigator>
        </ImageBackground>
      </PodcastIndexProvider>
    </NavigationContainer>
  );
};

