const PRODUCT_ALLOWED_FIELDS = [
  'name',
  'briefDescription',
  'description',
  'images',
  'category',
  'tags',
  'details',
  'price',
  'availability',
] as const;

const BLOG_ALLOWED_FIELDS = ['title', 'coverImage', 'content', 'author', 'date'] as const;

type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const hasOnlyAllowedFields = (payload: Record<string, unknown>, allowedFields: readonly string[]): boolean => {
  return Object.keys(payload).every((field) => allowedFields.includes(field));
};

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
};

const isDetailsRecord = (value: unknown): value is Record<string, string> => {
  if (!isObject(value)) {
    return false;
  }

  return Object.values(value).every((item) => typeof item === 'string');
};

export const validateProductCreatePayload = (payload: unknown): ValidationResult<Record<string, unknown>> => {
  if (!isObject(payload)) {
    return { ok: false, message: 'Product payload must be an object.' };
  }

  if (!hasOnlyAllowedFields(payload, PRODUCT_ALLOWED_FIELDS)) {
    return { ok: false, message: 'Product payload contains unsupported fields.' };
  }

  if (!isNonEmptyString(payload.name)) {
    return { ok: false, message: 'Product name is required.' };
  }

  if (!isNonEmptyString(payload.briefDescription)) {
    return { ok: false, message: 'Product briefDescription is required.' };
  }

  if (!isNonEmptyString(payload.description)) {
    return { ok: false, message: 'Product description is required.' };
  }

  if (!isStringArray(payload.images) || payload.images.length === 0 || payload.images.length > 20) {
    return { ok: false, message: 'Product images must be an array of 1 to 20 strings.' };
  }

  if (!isNonEmptyString(payload.category)) {
    return { ok: false, message: 'Product category is required.' };
  }

  if (typeof payload.price !== 'number' || !Number.isFinite(payload.price) || payload.price < 0) {
    return { ok: false, message: 'Product price must be a non-negative number.' };
  }

  if (
    payload.availability !== undefined &&
    payload.availability !== 'Available' &&
    payload.availability !== 'Sold Out'
  ) {
    return { ok: false, message: 'Product availability must be Available or Sold Out.' };
  }

  if (payload.tags !== undefined && !isStringArray(payload.tags)) {
    return { ok: false, message: 'Product tags must be an array of strings.' };
  }

  if (payload.details !== undefined && !isDetailsRecord(payload.details)) {
    return { ok: false, message: 'Product details must be an object with string values.' };
  }

  return { ok: true, data: payload };
};

export const validateProductUpdatePayload = (payload: unknown): ValidationResult<Record<string, unknown>> => {
  if (!isObject(payload)) {
    return { ok: false, message: 'Product payload must be an object.' };
  }

  if (Object.keys(payload).length === 0) {
    return { ok: false, message: 'Product update payload cannot be empty.' };
  }

  if (!hasOnlyAllowedFields(payload, PRODUCT_ALLOWED_FIELDS)) {
    return { ok: false, message: 'Product payload contains unsupported fields.' };
  }

  if (payload.name !== undefined && !isNonEmptyString(payload.name)) {
    return { ok: false, message: 'Product name must be a non-empty string.' };
  }

  if (payload.briefDescription !== undefined && !isNonEmptyString(payload.briefDescription)) {
    return { ok: false, message: 'Product briefDescription must be a non-empty string.' };
  }

  if (payload.description !== undefined && !isNonEmptyString(payload.description)) {
    return { ok: false, message: 'Product description must be a non-empty string.' };
  }

  if (payload.images !== undefined && (!isStringArray(payload.images) || payload.images.length === 0 || payload.images.length > 20)) {
    return { ok: false, message: 'Product images must be an array of 1 to 20 strings.' };
  }

  if (payload.category !== undefined && !isNonEmptyString(payload.category)) {
    return { ok: false, message: 'Product category must be a non-empty string.' };
  }

  if (payload.price !== undefined && (typeof payload.price !== 'number' || !Number.isFinite(payload.price) || payload.price < 0)) {
    return { ok: false, message: 'Product price must be a non-negative number.' };
  }

  if (
    payload.availability !== undefined &&
    payload.availability !== 'Available' &&
    payload.availability !== 'Sold Out'
  ) {
    return { ok: false, message: 'Product availability must be Available or Sold Out.' };
  }

  if (payload.tags !== undefined && !isStringArray(payload.tags)) {
    return { ok: false, message: 'Product tags must be an array of strings.' };
  }

  if (payload.details !== undefined && !isDetailsRecord(payload.details)) {
    return { ok: false, message: 'Product details must be an object with string values.' };
  }

  return { ok: true, data: payload };
};

export const validateBlogCreatePayload = (payload: unknown): ValidationResult<Record<string, unknown>> => {
  if (!isObject(payload)) {
    return { ok: false, message: 'Blog payload must be an object.' };
  }

  if (!hasOnlyAllowedFields(payload, BLOG_ALLOWED_FIELDS)) {
    return { ok: false, message: 'Blog payload contains unsupported fields.' };
  }

  if (!isNonEmptyString(payload.title)) {
    return { ok: false, message: 'Blog title is required.' };
  }

  if (!isNonEmptyString(payload.coverImage)) {
    return { ok: false, message: 'Blog coverImage is required.' };
  }

  if (!isNonEmptyString(payload.content)) {
    return { ok: false, message: 'Blog content is required.' };
  }

  if (!isNonEmptyString(payload.author)) {
    return { ok: false, message: 'Blog author is required.' };
  }

  if (payload.date !== undefined && Number.isNaN(Date.parse(String(payload.date)))) {
    return { ok: false, message: 'Blog date is invalid.' };
  }

  return { ok: true, data: payload };
};

export const validateBlogUpdatePayload = (payload: unknown): ValidationResult<Record<string, unknown>> => {
  if (!isObject(payload)) {
    return { ok: false, message: 'Blog payload must be an object.' };
  }

  if (Object.keys(payload).length === 0) {
    return { ok: false, message: 'Blog update payload cannot be empty.' };
  }

  if (!hasOnlyAllowedFields(payload, BLOG_ALLOWED_FIELDS)) {
    return { ok: false, message: 'Blog payload contains unsupported fields.' };
  }

  if (payload.title !== undefined && !isNonEmptyString(payload.title)) {
    return { ok: false, message: 'Blog title must be a non-empty string.' };
  }

  if (payload.coverImage !== undefined && !isNonEmptyString(payload.coverImage)) {
    return { ok: false, message: 'Blog coverImage must be a non-empty string.' };
  }

  if (payload.content !== undefined && !isNonEmptyString(payload.content)) {
    return { ok: false, message: 'Blog content must be a non-empty string.' };
  }

  if (payload.author !== undefined && !isNonEmptyString(payload.author)) {
    return { ok: false, message: 'Blog author must be a non-empty string.' };
  }

  if (payload.date !== undefined && Number.isNaN(Date.parse(String(payload.date)))) {
    return { ok: false, message: 'Blog date is invalid.' };
  }

  return { ok: true, data: payload };
};