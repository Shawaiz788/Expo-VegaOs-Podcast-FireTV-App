import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { scaleFontSize, scaleHeight, scaleWidth } from '../utils/scaling';
import podcasts from '../data/trending.json';

export interface PodcastDetailScreenProps {
  id: string | number;
}

export function PodcastDetailScreen({ id }: PodcastDetailScreenProps) {
  const podcast = (podcasts as any).feeds.find(
    (feed: any) => String(feed.id) === String(id),
  );

  if (!podcast) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Podcast not found</Text>
        <Text style={styles.meta}>id: {String(id)}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
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
});


