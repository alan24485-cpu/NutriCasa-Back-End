import request from 'supertest';
import server from '../app';

describe('Health Check', () => {
  it('GET /health debe responder 200', async () => {
    const res = await request(server.app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
  });
});