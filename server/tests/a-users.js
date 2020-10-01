import expect from 'expect';
import supertest from 'supertest';
import app from '../index';
import models from '../models';

let token;

const doBeforeAll = () => {
  before((done) => {
    models.Users.destroy({
      cascade: true,
      truncate: true,
      restartIdentity: true
    });
    done();
  });
};

const doBeforeEach = () => {
  beforeEach((done) => {
    models.sequelize.sync();
    done();
  });
};

describe('User API: ', () => {
  doBeforeAll();
  doBeforeEach();
  it('should create a new User', (done) => {
    supertest(app)
      .post('/signup')
      .send({
        username: 'temitayo',
        fullName: 'test user',
        email: 'temitayo@example.com',
        password: 'mypassword'
      })
      .expect(201)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('You have successfully signed up');
        done();
      });
  });
  it('should not create User with invalid email', (done) => {
    supertest(app)
      .post('/signup')
      .send({
        username: 'oriyomi',
        fullName: 'test user',
        email: 'temitayo',
        password: 'mypassword'
      })
      .expect(409)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res);
        done();
      });
  });
  it('should check username input', (done) => {
    supertest(app)
      .post('/signup')
      .send({
        username: 'temi tayo',
        fullName: 'test user',
        email: 'temitayo@example.com',
        password: 'mypassword'
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('Invalid Username');
        done();
      });
  });
  it('should check password input', (done) => {
    supertest(app)
      .post('/signup')
      .send({
        username: 'temitayo',
        fullName: 'test user',
        email: 'temitayo@example.com',
        password: 'mypassword 12',
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('Invalid Password');
        done();
      });
  });
  it('should check full name input', (done) => {
    supertest(app)
      .post('/signup')
      .send({
        username: 'temitayo',
        fullName: '  test user',
        email: 'temitayo@example.com',
        password: 'mypassword',
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('Invalid full name');
        done();
      });
  });
  it('should not pass back user password with response', (done) => {
    supertest(app)
      .post('/signup')
      .send({
        username: 'ruqoyah',
        fullName: 'test user',
        email: 'ruqoyah@example.com',
        password: 'mypassword'
      })
      .expect(201)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('You have successfully signed up');
        done();
      });
  });
  it('should not create user without passing in username', (done) => {
    supertest(app)
      .post('/signup')
      .send({
        fullName: 'test user',
        email: 'kola@example.com',
        password: 'mypassword'
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('Username is required');
        done();
      });
  });
  it('should check if username exceeds 5 characters', (done) => {
    supertest(app)
      .post('/signup')
      .send({
        username: 'test',
        fullName: 'test user',
        email: 'joyce@example.com',
        password: 'mypassword'
      })
      .expect(409)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res);
        done();
      });
  });
  it('should check if email is valid', (done) => {
    supertest(app)
      .post('/signup')
      .send({
        username: 'ruqoyah',
        fullName: 'test user',
        email: 'testuser1',
        password: 'mypassword'
      })
      .expect(409)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res);
        done();
      });
  });
  it('should check if password exceeds 5 characters', (done) => {
    supertest(app)
      .post('/signup')
      .send({
        username: 'temitope',
        fullName: 'test user',
        email: 'testuser1@example.com',
        password: 'mypa'
      })
      .expect(409)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res);
        done();
      });
  });
  it('should not create user without passing in fullname', (done) => {
    supertest(app)
      .post('/signup')
      .send({
        username: 'temitope',
        email: 'temitope@example.com',
        password: 'mypassword'
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('fullName is required');
        done();
      });
  });
  it('should not create user without passing in email', (done) => {
    supertest(app)
      .post('/signup')
      .send({
        username: 'temitope',
        fullName: 'test user',
        password: 'mypassword'
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('Email is required');
        done();
      });
  });
  it('should not create user without passing in password', (done) => {
    supertest(app)
      .post('/signup')
      .send({
        username: 'temitope',
        fullName: 'test user',
        email: 'temitope@example.com'
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('Password is required');
        done();
      });
  });
  it('should not create user with same username twice', (done) => {
    supertest(app)
      .post('/signup')
      .send({
        username: 'temitayo',
        fullName: 'test user',
        email: 'joyce@example.com',
        password: 'mypassword'
      })
      .expect(409)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('Username already exists');
        done();
      });
  });
  it('should not create user with the same email twice', (done) => {
    supertest(app)
      .post('/signup')
      .send({
        username: 'temitope',
        fullName: 'text user',
        email: 'temitayo@example.com',
        password: 'mypassword',
        cpassword: 'mypassword'
      })
      .expect(409)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('Email already exists');
        done();
      });
  });
  it('should login user', (done) => {
    supertest(app)
      .post('/login')
      .send({
        username: 'temitayo',
        password: 'mypassword'
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('You have successfully signed in!');
        done();
      });
  });
  it('should not sign user in with incorrect password', (done) => {
    supertest(app)
      .post('/login')
      .send({
        username: 'temitayo',
        password: 'mypasswor',
      })
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('Invalid Credentials');
        done();
      });
  });
  it('should not sign user in with incorrect credential', (done) => {
    supertest(app)
      .post('/login')
      .send({
        username: 'temita',
        password: 'mypasswor',
      })
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('Invalid Credentials');
        done();
      });
  });
  it('should not pass back user password with response', (done) => {
    supertest(app)
      .post('/login')
      .send({
        username: 'temitayo',
        password: 'mypassword',
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        token = res.body.data.token;
        expect(res.body.message).toBe('You have successfully signed in!');
        done();
      });
  });
  it('should not sign in user if no username provided', (done) => {
    supertest(app)
      .post('/login')
      .send({
        password: 'mypassword'
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('Please provide your username');
        done();
      });
  });
  it('should not sign in user if no password provided', (done) => {
    supertest(app)
      .post('/login')
      .send({
        username: 'temitayo'
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('Please provide your password');
        done();
      });
  });
  it('should get user details', (done) => {
    supertest(app)
      .get('/me')
      .send({
        token: `${token}`
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body);
        done();
      });
  });
});

