import request from 'supertest';
import { User } from "../models/user";
import { registerService } from "../services/auth.service";
import app from '../server';

jest.mock('../services/auth.service');
jest.mock('../models/user');

describe('Authentication API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('registers a new user', async () => {
        const res = await request(app)
            .post('/register')
            .send({ username: 'newuser@example.com', password: 'password123', role: 'user' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ token: 'access-token', message: 'USER REGISTERED' });
    });

    it('fails to register an existing user', async () => {
        const res = await request(app)
            .post('/register')
            .send({ username: 'newuser@example.com', password: 'password123', role: 'user' });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: 'User already exists' });
    });

    it('logs in a user', async () => {
        const response = await request(app)
            .post('/login')
            .send({ username: 'newuser@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ token: 'mocked-access-token', message: 'LOGGED IN' });
    });

    it('logs out a user', async () => {
        const response = await request(app).post('/logout');
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'LOGGED OUT' });
    });

    it('checks if user is authenticated', async () => {
        const response = await request(app).get('/user-authenticated');

        expect(response.status).toBe(200);
        expect(response.text).toBe('User is Authenticated');
    });
});
