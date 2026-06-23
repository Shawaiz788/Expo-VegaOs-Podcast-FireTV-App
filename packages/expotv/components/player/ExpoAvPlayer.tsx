import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import { scaleFontSize, scaleHeight, scaleWidth } from '@multitv/shared';

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function ExpoAvPlayer({
  src,
  onReady,
  autoplay,
}: {
  src: string;
  onReady?: () => void;
  autoplay?: boolean;
}) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationMs, setDurationMs] = useState(0);
  const [positionMs, setPositionMs] = useState(0);

  const safeAutoplay = autoplay ?? false;

  useEffect(() => {
    let mounted = true;

    const setup = async () => {
      // Cleanup existing sound
      if (soundRef.current) {
        try {
          await soundRef.current.unloadAsync();
        } catch {
          // ignore
        }
        soundRef.current = null;
      }

      const sound = new Audio.Sound();
      soundRef.current = sound;

  sound.setOnPlaybackStatusUpdate((status: any) => {
        if (!mounted) return;
        if (!status?.isLoaded) return;


        const durMs = (status.durationMillis ?? 0) || 0;
        const posMs = (status.positionMillis ?? 0) || 0;

        setDurationMs(durMs);
        setPositionMs(posMs);
        setIsPlaying(!!status.isPlaying);

        if (durMs > 0) {
          onReady?.();
        }
      });

      await sound.loadAsync({
        uri: src,
        shouldPlay: safeAutoplay,
      });

      if (safeAutoplay) {
        setIsPlaying(true);
      }
    };

    void setup();

    return () => {
      mounted = false;
      const cleanup = async () => {
        if (soundRef.current) {
          try {
            await soundRef.current.unloadAsync();
          } catch {
            // ignore
          }
          soundRef.current = null;
        }
      };
      void cleanup();
    };
  }, [src, safeAutoplay, onReady]);

  const togglePlay = async () => {
    const sound = soundRef.current;
    if (!sound) return;

    const status = await sound.getStatusAsync();
    if (!status.isLoaded) return;

    if (status.isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const seekToMs = async (targetMs: number) => {
    const sound = soundRef.current;
    if (!sound) return;

    const clamped = Math.max(0, Math.min(targetMs, durationMs || targetMs));
    await sound.setPositionAsync(clamped);
  };

  const onSeekPress = (e: any) => {
    const width = e?.nativeEvent?.layout?.width;
    const percent = width ? (e.nativeEvent.locationX / width) * 100 : 50;
    const p = Math.max(0, Math.min(100, percent));
    const target = ((durationMs || 0) * p) / 100;
    void seekToMs(target);
  };

  const progressPercent = useMemo(() => {
    if (!durationMs) return 0;
    return Math.max(0, Math.min(100, (positionMs / durationMs) * 100));
  }, [durationMs, positionMs]);

  return (
    <View style={styles.container}>
      <View style={styles.controlsRow}>
        <Pressable
          onPress={togglePlay}
          style={[styles.playButton, isPlaying && styles.playing]}
        >
          <Text style={styles.playButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </Pressable>
      </View>

      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatTime(positionMs)}</Text>
        <Text style={styles.timeText}>{formatTime(durationMs || 0)}</Text>
      </View>

      <Pressable onPress={onSeekPress} style={styles.seekBar}>
        <View style={[styles.seekFill, { width: `${progressPercent}%` }]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: scaleHeight(20),
  },
  controlsRow: {
    flexDirection: 'row',
    gap: scaleWidth(20),
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: scaleHeight(16),
    paddingHorizontal: scaleWidth(26),
  },
  playing: {
    borderColor: '#8f8ea3',
    backgroundColor: 'rgba(143,142,163,0.18)',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(26),
    fontWeight: '700',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: scaleFontSize(20),
  },
  seekBar: {
    height: scaleHeight(10),
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  seekFill: {
    height: '100%',
    backgroundColor: '#8f8ea3',
  },
});

