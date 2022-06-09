import request from 'supertest';
import app from '../../app';

describe('app', () => {
    it("returns a 404 on route that doesn't exist", async () => {
        return request(app).post('/404routenotfound').send().expect(404);
    });

    it('returns a 200 response if app is up', async () => {
        return request(app).get('/health').send().expect(200);
    });
});
