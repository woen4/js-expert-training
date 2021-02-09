import request from 'supertest';
import app from './api';

afterAll(() => {
  app.close();
});
describe('API suite test', () => {
  describe('/contacts', () => {
    it('should request the contact page and return HTTP status 200', async (done) => {
      const response = await request(app).get('/contact').expect(200);
      console.log(response.text);
      expect(response.text).toEqual('contact us page');
      done();
    });
  });

  describe('/hello', () => {
    it('should request an inexistent route /hi and redirect to /hello', async (done) => {
      const response = await request(app).get('/hi').expect(200);
      expect(response.text).toEqual('hello');
      done();
    });
  });

  describe('/login', () => {
    it('should login successfully on the login route and return HTTP status 200', async (done) => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'Kaio Woen', password: '123' })
        .expect(200);
      expect(response.text).toEqual('login has succeeded');
      done();
    });

    it('should login fail on the login route and return HTTP status 401', async (done) => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'Invalid user', password: 'invalid password' })
        .expect(401);
      expect(response.text).toEqual('invalid credentials');
      done();
    });
  });
});
