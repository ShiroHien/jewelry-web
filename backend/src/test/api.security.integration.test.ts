import { describe, expect, it, vi } from 'vitest';
import BlogPost from '../models/blogPost.model';
import cloudinary from '../config/cloudinary';
import { api, getAdminToken, getUserToken, setupIntegrationHarness } from './integrationHarness';

setupIntegrationHarness();

describe('API security integration', () => {
  it('allows CORS for allowlisted origin', async () => {
    process.env.CORS_ALLOWED_ORIGINS = 'http://allowed.local';

    const response = await api()
      .get('/')
      .set('Origin', 'http://allowed.local');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('http://allowed.local');
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

  it('rejects CORS for non-allowlisted origin', async () => {
    process.env.CORS_ALLOWED_ORIGINS = 'http://allowed.local';

    const response = await api()
      .get('/')
      .set('Origin', 'http://blocked.local');

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('CORS origin not allowed');
  });

  it('sanitizes blog payload on create', async () => {
    const token = await getAdminToken();

    const response = await api()
      .post('/api/blog')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '<img src=x onerror=alert(1)>My First Post',
        author: '<script>alert(1)</script>Admin',
        coverImage: 'https://cdn.example.com/cover.jpg',
        content: '<p>Safe text</p><script>alert(1)</script><a href="javascript:alert(1)">bad</a>',
        date: '2026-04-06'
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('My First Post');
    expect(response.body.author).toBe('Admin');
    expect(response.body.content).toBe('<p>Safe text</p><a>bad</a>');
    expect(response.body.slug).toBe('my-first-post');

    const storedPost = await BlogPost.findById(response.body._id).lean();
    expect(storedPost?.title).toBe('My First Post');
    expect(storedPost?.author).toBe('Admin');
    expect(storedPost?.content).toBe('<p>Safe text</p><a>bad</a>');
    expect(storedPost?.slug).toBe('my-first-post');
  });

  it('sanitizes blog payload on update', async () => {
    const token = await getAdminToken();

    const created = await api()
      .post('/api/blog')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Original Title',
        author: 'Admin',
        coverImage: 'https://cdn.example.com/cover.jpg',
        content: '<p>Original</p>'
      });

    const updated = await api()
      .put(`/api/blog/${created.body._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '<h2>Updated</h2><script>alert(1)</script>',
        content: '<p>Updated content</p><img src=x onerror=alert(1)>',
        author: '<b>Trusted</b>'
      });

    expect(updated.status).toBe(200);
    expect(updated.body.title).toBe('<h2>Updated</h2>');
    expect(updated.body.content).toBe('<p>Updated content</p>');
    expect(updated.body.author).toBe('Trusted');
    expect(updated.body.slug).toBe('h2updatedh2');
  });

  it('rejects upload request with missing file', async () => {
    const token = await getAdminToken();

    const response = await api()
      .post('/api/upload')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('No file uploaded.');
  });

  it('rejects upload request with invalid file type', async () => {
    const token = await getAdminToken();

    const response = await api()
      .post('/api/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', Buffer.from('not-an-image'), 'malicious.txt');

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('File upload only supports');
  });

  it('rejects upload request when file exceeds max size', async () => {
    const token = await getAdminToken();
    const oversizedBuffer = Buffer.alloc(6 * 1024 * 1024, 0xff);

    const response = await api()
      .post('/api/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', oversizedBuffer, 'too-large.jpg');

    expect(response.status).toBe(413);
    expect(response.body.message).toBe('File too large. Max upload size is 5MB.');
  });

  it('forbids non-admin users from creating blog posts', async () => {
    const token = await getUserToken();

    const response = await api()
      .post('/api/blog')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'User post',
        author: 'User',
        coverImage: 'https://cdn.example.com/cover.jpg',
        content: '<p>Should not be allowed</p>'
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Forbidden: admin access required');
  });

  it('forbids non-admin users from upload endpoint', async () => {
    const token = await getUserToken();

    const response = await api()
      .post('/api/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('image', Buffer.from('fake-image-bytes'), 'image.jpg');

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Forbidden: admin access required');
  });

  it('rejects blog payload with unsupported fields', async () => {
    const token = await getAdminToken();

    const response = await api()
      .post('/api/blog')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Safe title',
        author: 'Admin',
        coverImage: 'https://cdn.example.com/cover.jpg',
        content: '<p>Safe content</p>',
        injected: 'not-allowed'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Blog payload contains unsupported fields.');
  });

  it('rejects product payload with unsupported fields', async () => {
    const token = await getAdminToken();

    const response = await api()
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Amber Ring',
        briefDescription: 'Short description',
        description: 'Long product description',
        images: ['https://cdn.example.com/p1.jpg'],
        category: 'Rings',
        price: 1000000,
        availability: 'Available',
        tags: ['amber'],
        isAdmin: true
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Product payload contains unsupported fields.');
  });

  it('does not leak internal upload errors to clients', async () => {
    const token = await getAdminToken();
    const uploadSpy = vi
      .spyOn(cloudinary.uploader, 'upload')
      .mockRejectedValueOnce(new Error('cloudinary secret stack info'));

    try {
      const response = await api()
        .post('/api/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('image', Buffer.from('fake-jpeg-data'), 'safe.jpg');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error uploading image.');
      expect(response.body.error).toBeUndefined();
    } finally {
      uploadSpy.mockRestore();
    }
  });
});