import type { RichBlock } from '../components/common/RichText';
import data from './generated/richtext.json';

/** Aus reference/html extrahierte Langtexte (scripts/extract-richtext.py). */
const richtext = data as unknown as Record<string, RichBlock[]>;

export const getRichText = (key: string): RichBlock[] | undefined => richtext[key];
