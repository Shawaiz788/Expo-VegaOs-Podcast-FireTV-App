import { useRouter, useLocalSearchParams } from 'expo-router';
import { PodcastDetailScreen } from '@multitv/shared';

export default function PodcastDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <PodcastDetailScreen
      id={id!}
      onEpisodePress={(episodeId: number) =>
        router.push(`/player/${episodeId}`)
      }
    />
  );
}

