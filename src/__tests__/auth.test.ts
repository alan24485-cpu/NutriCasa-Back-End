import request from 'supertest';
import server from '../app';

// Mock manual del servicio de emails
jest.mock('../services/emailService', () => ({
  EmailService: {
    sendVerificationCode: jest.fn().mockResolvedValue(undefined),
    sendResetPasswordCode: jest.fn().mockResolvedValue(undefined),
    send2FACode: jest.fn().mockResolvedValue(undefined),
  }
}));

describe('POST /api/auth/register', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe registrar un usuario correctamente y devolver mensaje de verificación', async () => {
    const res = await request(server.app)
      .post('/api/auth/register')
      .send({
        name: 'Eduardo Test',
        email: `test_${Date.now()}@test.com`,
        password: 'Test1234!'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message');
  });

  it('debe fallar con 400 si el email ya está registrado', async () => {
    const emailRepetido = `duplicado_${Date.now()}@test.com`;

    // Primer registro
    await request(server.app)
      .post('/api/auth/register')
      .send({
        name: 'Eduardo',
        email: emailRepetido,
        password: 'Test1234!'
      });

    // Segundo intento
    const res = await request(server.app)
      .post('/api/auth/register')
      .send({
        name: 'Otro Eduardo',
        email: emailRepetido,
        password: 'OtraClave!'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

});