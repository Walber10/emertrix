import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { Organization } from '../models/organization.model';
import { User } from '../models/user.model';
import { onboardingRouter } from '../routes/onboarding.routes';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/onboarding', onboardingRouter);

describe('Onboarding Endpoints', () => {
  describe('POST /onboarding', () => {
    it('should create organization and admin successfully', async () => {
      const onboardingData = {
        organization: {
          name: 'Test Organization',
          address: '123 Test St',
          phoneNumber: '123-456-7890',
          industry: 'Technology',
          organizationSize: '11-50',
          selectedPlan: 'tier1',
          maxFacilities: 5,
          totalSeats: 100,
        },
        admin: {
          name: 'Admin User',
          email: 'admin@test.com',
          password: 'password123',
          phone: '123-456-7890',
        },
        invitedAdmins: [
          {
            name: 'Invited Admin',
            email: 'invited@test.com',
            phone: '123-456-7890',
          },
        ],
      };

      const response = await request(app).post('/onboarding').send(onboardingData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.organization).toBeDefined();
      expect(response.body.data.owner).toBeDefined();
      expect(response.body.data.invitedAdmins).toBeDefined();

      // Verify organization was created
      const org = await Organization.findById(response.body.data.organization._id);
      expect(org).toBeDefined();
      expect(org?.name).toBe('Test Organization');

      // Verify admin was created
      const admin = await User.findById(response.body.data.owner._id);
      expect(admin).toBeDefined();
      expect(admin?.email).toBe('admin@test.com');
      expect(admin?.role).toBe('admin');
    });

    it('should fail with missing organization name', async () => {
      const onboardingData = {
        organization: {
          address: '123 Test St',
          phoneNumber: '123-456-7890',
          industry: 'Technology',
          organizationSize: '11-50',
          selectedPlan: 'tier1',
          maxFacilities: 5,
          totalSeats: 100,
        },
        admin: {
          name: 'Admin User',
          email: 'admin@test.com',
          password: 'password123',
        },
      };

      const response = await request(app).post('/onboarding').send(onboardingData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Organization name is required');
    });

    it('should fail with missing admin email', async () => {
      const onboardingData = {
        organization: {
          name: 'Test Organization',
          address: '123 Test St',
          phoneNumber: '123-456-7890',
          industry: 'Technology',
          organizationSize: '11-50',
          selectedPlan: 'tier1',
          maxFacilities: 5,
          totalSeats: 100,
        },
        admin: {
          name: 'Admin User',
          password: 'password123',
        },
      };

      const response = await request(app).post('/onboarding').send(onboardingData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Please provide a valid email address');
    });

    it('should fail with invalid email format', async () => {
      const onboardingData = {
        organization: {
          name: 'Test Organization',
          address: '123 Test St',
          phoneNumber: '123-456-7890',
          industry: 'Technology',
          organizationSize: '11-50',
          selectedPlan: 'tier1',
          maxFacilities: 5,
          totalSeats: 100,
        },
        admin: {
          name: 'Admin User',
          email: 'invalid-email',
          password: 'password123',
        },
      };

      const response = await request(app).post('/onboarding').send(onboardingData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Please provide a valid email address');
    });

    it('should fail with short password', async () => {
      const onboardingData = {
        organization: {
          name: 'Test Organization',
          address: '123 Test St',
          phoneNumber: '123-456-7890',
          industry: 'Technology',
          organizationSize: '11-50',
          selectedPlan: 'tier1',
          maxFacilities: 5,
          totalSeats: 100,
        },
        admin: {
          name: 'Admin User',
          email: 'admin@test.com',
          password: '123',
        },
      };

      const response = await request(app).post('/onboarding').send(onboardingData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Password must be at least 6 characters long');
    });

    it('should fail with invalid plan selection', async () => {
      const onboardingData = {
        organization: {
          name: 'Test Organization',
          address: '123 Test St',
          phoneNumber: '123-456-7890',
          industry: 'Technology',
          organizationSize: '11-50',
          selectedPlan: 'invalid-plan',
          maxFacilities: 5,
          totalSeats: 100,
        },
        admin: {
          name: 'Admin User',
          email: 'admin@test.com',
          password: 'password123',
        },
      };

      const response = await request(app).post('/onboarding').send(onboardingData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Plan selection is required');
    });

    it('should create organization without invited admins', async () => {
      const onboardingData = {
        organization: {
          name: 'Test Organization',
          address: '123 Test St',
          phoneNumber: '123-456-7890',
          industry: 'Technology',
          organizationSize: '11-50',
          selectedPlan: 'free',
          maxFacilities: 1,
          totalSeats: 10,
        },
        admin: {
          name: 'Admin User',
          email: 'admin@test.com',
          password: 'password123',
        },
      };

      const response = await request(app).post('/onboarding').send(onboardingData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.invitedAdmins).toEqual([]);
    });
  });
});
