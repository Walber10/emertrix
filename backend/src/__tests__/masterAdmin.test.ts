import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { User } from '../models/user.model';
import { Organization } from '../models/organization.model';
import { UserRole, InviteStatus } from '../models/user.model';
import bcrypt from 'bcryptjs';
import masterAdminRouter from '../routes/master-admin.routes';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/master', masterAdminRouter);
app.use('/auth', require('../routes/auth.routes').default);

describe('Master Admin Endpoints', () => {
  let masterAdmin: any;
  let regularAdmin: any;
  let testOrg: any;

  beforeEach(async () => {
    // Create a master admin
    const hashedPassword = await bcrypt.hash('master123', 10);
    masterAdmin = await User.create({
      organizationId: null,
      name: 'Master Admin',
      email: `master-${Date.now()}@test.com`,
      phone: '123-456-7890',
      password: hashedPassword,
      role: UserRole.MASTER,
      isPointOfContact: false,
      inviteStatus: InviteStatus.ACCEPTED,
      createdAt: new Date(),
    });

    // Create a test organization
    testOrg = await Organization.create({
      name: 'Test Organization',
      address: '123 Test St',
      phoneNumber: '123-456-7890',
      industry: 'Technology',
      organizationSize: '11-50',
      selectedPlan: 'tier1',
      maxFacilities: 5,
      totalSeats: 100,
      createdAt: new Date(),
    });

    // Create a regular admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    regularAdmin = await User.create({
      organizationId: testOrg._id,
      name: 'Regular Admin',
      email: `admin-${Date.now()}@test.com`,
      phone: '123-456-7890',
      password: adminPassword,
      role: UserRole.ADMIN,
      isPointOfContact: false,
      inviteStatus: InviteStatus.ACCEPTED,
      createdAt: new Date(),
    });

    // Update organization with adminId
    testOrg.adminId = regularAdmin._id;
    await testOrg.save();
  });

  describe('GET /master/organizations', () => {
    it('should return organizations when accessed by master admin', async () => {
      // First, log in as master admin to get the cookie
      const loginResponse = await request(app).post('/auth/login').send({
        email: masterAdmin.email,
        password: 'master123',
      });

      expect(loginResponse.status).toBe(200);
      const cookies = loginResponse.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const cookieString = Array.isArray(cookies) ? cookies.join(';') : cookies;

      // Now, access the protected endpoint with the cookie
      const response = await request(app).get('/master/organizations').set('Cookie', cookieString);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.organizations).toBeDefined();
      expect(Array.isArray(response.body.organizations)).toBe(true);
      expect(response.body.organizations.length).toBeGreaterThan(0);

      const org = response.body.organizations[0];
      expect(org.name).toBe('Test Organization');
      expect(org.userCount).toBeDefined();
      expect(typeof org.userCount).toBe('number');
    });

    it('should fail when accessed by regular admin', async () => {
      // First, log in as regular admin to get the cookie
      const loginResponse = await request(app).post('/auth/login').send({
        email: regularAdmin.email,
        password: 'admin123',
      });

      expect(loginResponse.status).toBe(200);
      const cookies = loginResponse.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const cookieString = Array.isArray(cookies) ? cookies.join(';') : cookies;

      // Now, access the protected endpoint with the cookie
      const response = await request(app).get('/master/organizations').set('Cookie', cookieString);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Access denied');
    });

    it('should fail when not authenticated', async () => {
      const response = await request(app).get('/master/organizations');

      expect(response.status).toBe(401);
    });
  });
});
