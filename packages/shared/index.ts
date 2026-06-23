export {Header} from './src/components/Header/Header';
export {HomeScreen} from './src/screens/HomeScreen';
export {PodcastDetailScreen} from './src/screens/PodcastDetailScreen';
export {ApiDemo} from './src/components/ApiDemo';


export {
  scaleFontSize,
  scaleWidth,
  scaleHeight,
} from './src/utils/scaling';

export {createHttpClient} from './src/services/httpClient';
export type {HttpClientConfig, HttpResponse} from './src/services/httpClient';

// Podcast Index hooks (used by platform player containers)
export {
  useFeedById,
  useEpisodeById,
  useEpisodesByFeedId,
  useSearchPodcasts,
  useTrending,
  PodcastIndexProvider,
} from './src/context/PodcastIndexContext';

export {digestSHA1} from './src/crypto/digestSHA1';

export {PlayerScreen} from './src/screens/PlayerScreen';
export type {PlayerState} from './src/screens/PlayerScreen';
export {SearchScreen} from './src/screens/SearchScreen';
export {PodcastDetailsScreen} from './src/screens/PodcastDetailsScreen';
