import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, closeTestDB, clearTestDB } from './setup.js';

describe('Auth API', () => {
  before(async () => {
    await connectTestDB();
  });

  after(async () => {
    await closeTestDB();
  });

  afterEach(async () => {
    await clearTestDB(); // har test ke baad DB clean, taake tests ek dusre ko affect na karein
  });

  describe('POST /api/auth/signup', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
      });

      expect(res.status).to.equal(201);
      expect(res.body.success).to.be.true;
      expect(res.body.user).to.have.property('email', 'test@example.com');
      expect(res.body.user).to.not.have.property('password'); // password kabhi response mein nahi jana chahiye
    });

    it('should not allow duplicate email signup', async () => {
      await request(app).post('/api/auth/signup').send({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
      });

      const res = await request(app).post('/api/auth/signup').send({
        name: 'Another User',
        email: 'test@example.com',
        password: '654321',
      });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.match(/already exists/i);
    });

    it('should fail if required fields are missing', async () => {
      const res = await request(app).post('/api/auth/signup').send({
        email: 'test@example.com',
      });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Har login test se pehle ek user register karo
      await request(app).post('/api/auth/signup').send({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
      });
    });

    it('should login with correct credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: '123456',
      });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.headers['set-cookie']).to.exist; // JWT cookie set honi chahiye
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).to.equal(401);
      expect(res.body.success).to.be.false;
    });

    it('should reject login for non-existent user', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nouser@example.com',
        password: '123456',
      });

      expect(res.status).to.equal(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout and clear the cookie', async () => {
      const res = await request(app).post('/api/auth/logout');

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
    });
  });
});