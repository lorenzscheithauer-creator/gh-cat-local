export const API_BASE =
  process.env.EXPO_PUBLIC_API_BASE?.replace(/\/+$/, '') ||
  'https://www.gewinnhai.de/api';

export const MEDIA_BASE =
  process.env.EXPO_PUBLIC_MEDIA_BASE?.replace(/\/+$/, '') ||
  'https://www.gewinnhai.de';
