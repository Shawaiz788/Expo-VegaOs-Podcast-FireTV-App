import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {AudioPlayer as W3CAudioPlayer} from '@amazon-devices/react-native-w3cmedia/dist/interface/AudioPlayer';
import {AudioPlayer} from '@amazon-devices/react-native-w3cmedia/dist/interface/AudioPlayer';

import {scaleFontSize, scaleHeight, scaleWidth} from '@multitv/shared';

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function W3CPlayer({
  src,
  onReady,
  autoplay,
}: {
  src: string;
  onReady?: () => void;
  autoplay?: boolean;
}) {
  const playerRef = useRef<W3CAudioPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [durationMs, setDurationMs] = useState(0);
  const [positionMs, setPositionMs] = useState(0);

  const safeAutoplay = autoplay ?? false;

  useEffect(() => {
    let cancelled = false;

    const player = new AudioPlayer();
    playerRef.current = player;

    const onPlay = () => {
      if (cancelled) return;
      setIsPlaying(true);
      setIsLoading(false);
    };
    const onPause = () => {
      if (cancelled) return;
      setIsPlaying(false);
    };
    const onTimeUpdate = () => {
      if (cancelled) return;
      setPositionMs((player.currentTime ?? 0) * 1000);
      setIsLoading(false);
    };
    const onDuration = () => {
      if (cancelled) return;
      setDurationMs((player.duration ?? 0) * 1000);
    };
    const onLoaded = () => {
      if (cancelled) return;
      setIsLoading(false);
      onReady?.();
      setDurationMs((player.duration ?? 0) * 1000);
      setPositionMs((player.currentTime ?? 0) * 1000);
    };
    const onError = () => {
      if (cancelled) return;
      setIsLoading(false);
    };

    player.addEventListener('play', onPlay);
    player.addEventListener('pause', onPause);
    player.addEventListener('timeupdate', onTimeUpdate);
    player.addEventListener('durationchange', onDuration);
    player.addEventListener('loadedmetadata', onLoaded);
    player.addEventListener('error', onError);

    (async () => {
      try {
        setIsLoading(true);
        await player.initialize();
        if (cancelled) return;
        player.autoplay = safeAutoplay;
        player.src = src;
        await player.play?.();
      } catch {
        // play may throw depending on platform permissions
        setIsLoading(false);
        if (!cancelled) onReady?.();
      }
    })();

    return () => {
      cancelled = true;
      try {
        player.removeEventListener('play', onPlay);
        player.removeEventListener('pause', onPause);
        player.removeEventListener('timeupdate', onTimeUpdate);
        player.removeEventListener('durationchange', onDuration);
        player.removeEventListener('loadedmetadata', onLoaded);
        player.removeEventListener('error', onError);
      } catch {
        // ignore
      }
      player.deinitialize?.().catch?.(() => undefined);
      playerRef.current = null;
    };
  }, [src, safeAutoplay, onReady]);

  const togglePlay = useCallback(async () => {
    const player = playerRef.current;
    if (!player) return;

    try {
      if (player.paused) {
        await player.play?.();
      } else {
        await player.pause?.();
      }
    } catch {
      // ignore
    }
  }, []);

  const seekToMs = useCallback(
    async (targetMs: number) => {
      const player = playerRef.current;
      if (!player) return;

      const clampedMs = Math.max(0, Math.min(targetMs, durationMs || targetMs));
      try {
        player.currentTime = clampedMs / 1000;
      } catch {
        // ignore
      }
      setPositionMs(clampedMs);
    },
    [durationMs],
  );

  const onSeekPress = useCallback(
    (e: any) => {
      const width = e?.nativeEvent?.layout?.width;
      const percent = width ? (e.nativeEvent.locationX / width) * 100 : 50;
      const p = Math.max(0, Math.min(100, percent));
      const target = ((durationMs || 0) * p) / 100;
      void seekToMs(target);
    },
    [durationMs, seekToMs],
  );

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
        <View style={[styles.seekFill, {width: `${progressPercent}%`}]} />
      </Pressable>

      {isLoading ? <Text style={styles.loading}>Loading...</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: scaleHeight(20),
  },
  loading: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: scaleFontSize(20),
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



