import React from 'react';
import {PlayerScreenContainer} from './PlayerScreenContainer';

export function PlayerScreen({episodeId}: {episodeId: number}) {
  return <PlayerScreenContainer episodeId={episodeId} />;
}



