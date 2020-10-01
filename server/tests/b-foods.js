import expect from 'expect';
import supertest from 'supertest';
import app from '../index';
import models from '../models';

let token;
let otherToken;

const doBeforeAll = () => {
  before((done) => {
    models.Foods.destroy({
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

describe('Food API: ', () => {
  doBeforeAll();
  doBeforeEach();
  it('should sign user in', (done) => {
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
        token = res.body.data.token;
        expect(res.body.message).toBe('You have successfully signed in!');
        done();
      });
  });
  it('should sign user in', (done) => {
    supertest(app)
      .post('/login')
      .send({
        username: 'admin',
        password: 'password'
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        otherToken = res.body.data.token;
        expect(res.body.message).toBe('You have successfully signed in!');
        done();
      });
  });
  it('should not add food without providing a token', (done) => {
    supertest(app)
      .post('/admin/menu')
      .send({
        name: 'Pizza',
        description: 'pepper, flour, onions',
        picture: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg'
      })
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('No token provided.');
        done();
      });
  });
  it('should be able to add food providing an admin token', (done) => {
    supertest(app)
      .post('/admin/menu')
      .send({
        name: 'Pizza',
        description: 'pepper, flour, onions',
        picture: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg',
        token: `${otherToken}`
      })
      .expect(201)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('Food added successfully');
        done();
      });
  });
  it('should not add the same food name twice', (done) => {
    supertest(app)
      .post('/admin/menu')
      .send({
        name: 'Pizza',
        description: 'pepper, flour, onions',
        picture: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg',
        token: `${token}`
      })
      .expect(409)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('You have already created food');
        done();
      });
  });
  it('should not be able to add food with an invalid token', (done) => {
    supertest(app)
      .post('/admin/menu')
      .send({
        name: 'Pizza',
        description: 'pepper, flour, onions',
        picture: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg',
        token: 'dsjghkdDWHSJkjdskldsxkldsjkldsxdslk'
      })
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('Failed to authenticate token.');
        done();
      });
  });
  it('should not create food without food name', (done) => {
    supertest(app)
      .post('/admin/menu')
      .send({
        description: 'pepper, flour, onions',
        picture: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg',
        token: `${token}`
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('Enter food name');
        done();
      });
  });
  it('should not create food with a user token', (done) => {
    supertest(app)
      .post('/admin/menu')
      .send({
        name: 'Pizza',
        description: 'pepper, flour, onions',
        picture: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg',
        token: `${token}`
      })
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('You do not have access to perform this action');
        done();
      });
  });
  it('should not create food without picture', (done) => {
    supertest(app)
      .post('/admin/menu')
      .send({
        name: 'Pizza',
        description: 'pepper, flour, onions',
        picture: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg',
        token: `${token}`
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('You need to upload a picture');
        done();
      });
  });
  it('should be able to get all recipes', (done) => {
    supertest(app)
      .get('/menu')
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
  it('should not show foods on the next page', (done) => {
    supertest(app)
      .get('/menu?page=2')
      .send({
        token: `${token}`
      })
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('Sorry no food found for this page');
        done();
      });
  });
  it('should not be able to get food if no food', (done) => {
    supertest(app)
      .get('/menu')
      .send({
        token: `${token}`
      })
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('No food found');
        done();
      });
  });
});
