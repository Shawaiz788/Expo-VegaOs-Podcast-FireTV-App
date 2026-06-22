import { useLocalSearchParams } from 'expo-router';
import { PodcastDetailScreen } from '@multitv/shared';

export default function PodcastDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PodcastDetailScreen id={id!} />;
}

