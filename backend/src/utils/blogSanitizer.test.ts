import { describe, expect, it } from 'vitest';
import { sanitizeBlogField, sanitizeBlogPayload } from './blogSanitizer';

describe('blogSanitizer', () => {
  it('removes script tags from content', () => {
    const input = '<p>Hello</p><script>alert(1)</script>';
    const output = sanitizeBlogField(input);

    expect(output).toBe('<p>Hello</p>');
  });

  it('drops javascript URI from links', () => {
    const input = '<a href="javascript:alert(1)">Click</a>';
    const output = sanitizeBlogField(input);

    expect(output).toBe('<a>Click</a>');
  });

  it('sanitizes known blog fields from payload', () => {
    const payload = {
      title: '<img src=x onerror=alert(1)>My Post',
      author: '<b>Admin</b>',
      content: '<p>Body</p><script>alert(1)</script>',
      coverImage: 'https://cdn.example.com/image.jpg',
      date: '2026-04-06'
    };

    const result = sanitizeBlogPayload(payload);

    expect(result.title).toBe('My Post');
    expect(result.author).toBe('Admin');
    expect(result.content).toBe('<p>Body</p>');
    expect(result.coverImage).toBe('https://cdn.example.com/image.jpg');
    expect(result.date).toBe('2026-04-06');
  });
});