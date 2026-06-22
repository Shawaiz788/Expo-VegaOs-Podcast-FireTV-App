import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Episode } from '../types';
import { scaleFontSize, scaleHeight, scaleWidth } from '../utils/scaling';

export function EpisodeItem({
  episode,
  focused,
  onFocus,
}: {
  episode: Episode;
  focused?: boolean;
  onFocus?: (episodeId: number) => void;
}) {
  return (
    <Pressable
      onFocus={() => onFocus?.(episode.id)}
      onBlur={() => onFocus?.(episode.id)}
      style={[styles.container, focused && styles.focusedContainer]}
    >
      <Image
        style={styles.thumb}
        source={{ uri: episode.image || 'about:blank' }}
        // RN requires a valid object; we fallback to a harmless placeholder.
      />


      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {typeof episode.episode === 'number' ? `#${episode.episode} ` : ''}
          {episode.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {episode.datePublishedPretty || episode.datePublished.toString()}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleWidth(20),
    paddingVertical: scaleHeight(20),
    paddingHorizontal: scaleWidth(20),
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  focusedContainer: {
    backgroundColor: 'rgba(143,142,163,0.18)',
    borderColor: '#8f8ea3',
    borderWidth: 2,
  },

  thumb: {
    width: scaleWidth(100),
    height: scaleWidth(100),
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  textContainer: {
    flex: 1,
  },

  title: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(26),
    fontWeight: '600',
  },

  meta: {
    marginTop: scaleHeight(6),
    color: 'rgba(255,255,255,0.65)',
    fontSize: scaleFontSize(20),
  },
});

