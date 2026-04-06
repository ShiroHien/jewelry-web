import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'u',
  'h1',
  'h2',
  'h3',
  'h4',
  'blockquote',
  'ul',
  'ol',
  'li',
  'a'
];

const ALLOWED_ATTRIBUTES: sanitizeHtml.IOptions['allowedAttributes'] = {
  a: ['href', 'name', 'target', 'rel']
};

const ALLOWED_SCHEMES = ['http', 'https', 'mailto'];

export const sanitizeBlogField = (value: unknown): string => {
  const normalizedValue = typeof value === 'string' ? value : '';

  return sanitizeHtml(normalizedValue, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ALLOWED_SCHEMES,
    disallowedTagsMode: 'discard'
  }).trim();
};

export const sanitizeBlogPayload = <T extends Record<string, unknown>>(payload: T): T => {
  const sanitizedPayload = { ...payload };

  if ('title' in sanitizedPayload) {
    sanitizedPayload.title = sanitizeBlogField(sanitizedPayload.title);
  }

  if ('author' in sanitizedPayload) {
    sanitizedPayload.author = sanitizeBlogField(sanitizedPayload.author);
  }

  if ('coverImage' in sanitizedPayload) {
    sanitizedPayload.coverImage = sanitizeBlogField(sanitizedPayload.coverImage);
  }

  if ('content' in sanitizedPayload) {
    sanitizedPayload.content = sanitizeBlogField(sanitizedPayload.content);
  }

  return sanitizedPayload;
};