import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EpisodeItem } from '../components/EpisodeItem';
import episodesJson from '../data/episodes.json';
import podcasts from '../data/trending.json';
import { scaleFontSize, scaleHeight, scaleWidth } from '../utils/scaling';
import type { Episode } from '../types';

export interface PodcastDetailScreenProps {
  id: string | number;
}

export function PodcastDetailScreen({ id }: PodcastDetailScreenProps) {
  const podcast = (podcasts as any).feeds.find(
    (feed: any) => String(feed.id) === String(id),
  );

  const episodes = useMemo(() => {
    const episodes = (episodesJson as any) as { items?: Episode[] };
    // episodes.json includes a query field in its payload; for this UI we just show the items.
    return (episodes.items ?? []) as Episode[];
  }, []);

  const [focusedEpisodeId, setFocusedEpisodeId] = useState<number | null>(
    episodes[0]?.id ?? null,
  );

  // If episodes array is populated after mount, ensure default focus is the first item.
  React.useEffect(() => {
    if (focusedEpisodeId == null && episodes[0]?.id != null) {
      setFocusedEpisodeId(episodes[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodes]);

  if (!podcast) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Podcast not found</Text>
        <Text style={styles.meta}>id: {String(id)}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Image
          style={styles.artwork}
          source={{ uri: podcast.artwork || podcast.image }}
        />

        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={2}>
            {podcast.title}
          </Text>

          <Text style={styles.author} numberOfLines={1}>
            {podcast.author}
          </Text>

          <Text style={styles.meta}>id: {String(podcast.id)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>About</Text>
      <Text style={styles.description}>{podcast.description}</Text>

      <Text style={styles.sectionTitle}>Episodes</Text>
      <View style={styles.episodesList}>
        {episodes.map((episode) => (
          <EpisodeItem
            key={episode.id}
            episode={episode}
            focused={focusedEpisodeId === episode.id}
            onFocus={(episodeId) => setFocusedEpisodeId(episodeId)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scaleWidth(160),
    backgroundColor: 'black',
  },

  content: {
    gap: scaleHeight(40),
    paddingBottom: scaleHeight(60),
  },

  header: {
    flexDirection: 'row',
    gap: scaleWidth(40),
  },

  artwork: {
    width: scaleWidth(400),
    height: scaleWidth(400),
    borderRadius: 16,
  },

  headerText: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: scaleFontSize(48),
    fontWeight: '700',
    color: '#FFFFFF',
  },

  author: {
    fontSize: scaleFontSize(28),
    opacity: 0.8,
    color: '#FFFFFF',
    marginTop: scaleHeight(10),
  },

  meta: {
    fontSize: scaleFontSize(20),
    opacity: 0.6,
    color: '#FFFFFF',
    marginTop: scaleHeight(10),
  },

  sectionTitle: {
    fontSize: scaleFontSize(32),
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: scaleHeight(10),
  },

  description: {
    fontSize: scaleFontSize(24),
    lineHeight: scaleHeight(40),
    color: '#FFFFFF',
    opacity: 0.9,
  },

  episodesList: {
    gap: scaleHeight(20),
  },
});



