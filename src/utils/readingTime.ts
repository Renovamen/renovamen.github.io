export interface ReadingTimeOptions {
  /**
   * Number of Chinese words per minute a user can read
   *
   * @default 300
   */
  wordsPerMinuteCN?: number;

  /**
   * Number of English words per minute a user can read
   *
   * @default 200
   */
  wordsPerMinuteEN?: number;

  /**
   * Excludes all content inside code blocks or not
   *
   * @default false
   */
  excludeCodeBlock?: boolean;

  /**
   * Excludes all content inside tex blocks or not
   *
   * @default false
   */
  excludeTexBlock?: boolean;
}

export interface ReadingTime {
  /**
   * Expect reading time (number of minutes)
   */
  minutes: number;
  /**
   * Number of words of the page
   */
  words: number;
}

const CHINESE_CHAR_REGEX = /[\u4E00-\u9FA5]/g;
const NON_LATIN_WORD_REGEX =
  /[a-zA-Z0-9_\u0392-\u03c9\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|\w+/g;
const CODE_BLOCK_REGEX = /```[\s\S]*?```/g;
const TEX_BLOCK_REGEX = /\$\$[\s\S]*?\$\$/g;

const countMatches = (text: string, pattern: RegExp) =>
  (text.match(pattern) ?? []).length;

const getNumCN = (text: string) => countMatches(text, CHINESE_CHAR_REGEX);

const getNumEN = (text: string) =>
  countMatches(text.replace(CHINESE_CHAR_REGEX, ""), NON_LATIN_WORD_REGEX);

const excludeCodeBlock = (text: string) => text.replace(CODE_BLOCK_REGEX, "");

const excludeTexBlock = (text: string) => text.replace(TEX_BLOCK_REGEX, "");

export const readingTime = (text: string, options?: ReadingTimeOptions): ReadingTime => {
  const normalizedOptions = options ?? {};
  const wordsPerMinuteCN = normalizedOptions.wordsPerMinuteCN || 300;
  const wordsPerMinuteEN = normalizedOptions.wordsPerMinuteEN || 200;
  let content = text;

  // exclude all content inside code blocks
  if (normalizedOptions.excludeCodeBlock) content = excludeCodeBlock(content);
  // exclude all content inside tex blocks
  if (normalizedOptions.excludeTexBlock) content = excludeTexBlock(content);

  // number of chinese words and english words
  const cntCN = getNumCN(content);
  const cntEN = getNumEN(content);

  // compute reading time
  let minutes = cntCN / wordsPerMinuteCN + cntEN / wordsPerMinuteEN;
  minutes = minutes < 1 ? 1 : Math.ceil(Number(minutes.toFixed(2)));

  return {
    minutes,
    words: cntCN + cntEN
  };
};
