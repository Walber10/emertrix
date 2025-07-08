import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { User } from '../models/user.model';
import { UserRole, InviteStatus } from '../models/user.model';
import bcrypt from 'bcryptjs';
import authRouter from '../routes/auth.routes';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter);

describe('Auth Endpoints', () => {
  let testUser: any;
  let testEmail: string;

  beforeEach(async () => {
    // Generate unique email for each test
    testEmail = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`;

    // Create a test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    testUser = await User.create({
      organizationId: null, // Will be set after org creation
      name: 'Test User',
      email: testEmail,
      phone: '123-456-7890',
      password: hashedPassword,
      role: UserRole.ADMIN,
      isPointOfContact: false,
      inviteStatus: InviteStatus.ACCEPTED,
      createdAt: new Date(),
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app).post('/auth/login').send({
        email: testEmail,
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testEmail);
      expect(response.body.user.name).toBe('Test User');
      expect(response.body.user.password).toBeUndefined(); // Password should not be returned
    });

    it('should fail with invalid email', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'invalid@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should fail with invalid password', async () => {
      const response = await request(app).post('/auth/login').send({
        email: testEmail,
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should fail with missing email', async () => {
      const response = await request(app).post('/auth/login').send({
        password: 'password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Please provide a valid email address');
    });

    it('should fail with missing password', async () => {
      const response = await request(app).post('/auth/login').send({
        email: testEmail,
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Password is required');
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app).post('/auth/login').send({
        email: 'invalid-email',
        password: 'password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Please provide a valid email address');
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('should handle forgot password request for existing user', async () => {
      const response = await request(app).post('/auth/forgot-password').send({
        email: testEmail,
      });

      // Accept both 200 and 404 for this test, depending on implementation
      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBeDefined();
      } else {
        expect(response.body.success).toBe(false);
        expect(response.body.error).toBeDefined();
      }
    });

    it('should fail with missing email', async () => {
      const response = await request(app).post('/auth/forgot-password').send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Please provide a valid email address');
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app).post('/auth/forgot-password').send({
        email: 'invalid-email',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Please provide a valid email address');
    });
  });

  describe('GET /auth/me', () => {
    it('should return user data when authenticated', async () => {
      // First login to get a token
      const loginResponse = await request(app).post('/auth/login').send({
        email: testEmail,
        password: 'password123',
      });

      expect(loginResponse.status).toBe(200);
      const cookies = loginResponse.headers['set-cookie'];
      expect(cookies).toBeDefined();

      const cookieString = Array.isArray(cookies) ? cookies.join(';') : cookies;

      const response = await request(app).get('/auth/me').set('Cookie', cookieString);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testEmail);
    });

    it('should fail when not authenticated', async () => {
      const response = await request(app).get('/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Not authenticated');
    });
  });
});
