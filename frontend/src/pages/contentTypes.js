export const CONTENT_TYPES = [
  { value: 'reel', label: 'ریلز', color: '#C79A5B' },
  { value: 'post', label: 'پست', color: '#9CAF88' },
  { value: 'story', label: 'استوری', color: '#B98CA0' },
  { value: 'carousel', label: 'کاروسل', color: '#7C93AA' },
  { value: 'photo', label: 'عکس', color: '#C97B5C' },
];

export function typeMeta(value) {
  return CONTENT_TYPES.find((t) => t.value === value) || CONTENT_TYPES[0];
}
