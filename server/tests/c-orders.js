import expect from 'expect';
import supertest from 'supertest';
import app from '../index';
import models from '../models';

let orderId;
let token;
let otherToken;

const doBeforeAll = () => {
  before((done) => {
    models.Orders.destroy({
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

describe('Order API: ', () => {
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
  it('should not place order without providing a token', (done) => {
    supertest(app)
      .post('/order')
      .send({
        foodId: 1,
        quantity: 1
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
  it('should be able to place order providing a token', (done) => {
    supertest(app)
      .post('/order')
      .send({
        foodId: 1,
        quantity: 1,
        token: `${token}`
      })
      .expect(201)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        orderId = res.body.data.id;
        expect(res.body.message).toBe('Food added successfully');
        done();
      });
  });
  it('should not be able to place order with an invalid token', (done) => {
    supertest(app)
      .post('/order')
      .send({
        foodId: 1,
        quantity: 1,
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
  it('should not create place order without quanity', (done) => {
    supertest(app)
      .post('/order')
      .send({
        foodId: 1,
        token: `${token}`
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('You need to provide quantity');
        done();
      });
  });
  it('should not place order without food id', (done) => {
    supertest(app)
      .post('/order')
      .send({
        quantity: 1,
        token: `${token}`
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('You need to provide food id');
        done();
      });
  });
  it('should be able to update order', (done) => {
    supertest(app)
      .put(`/order/${orderId}`)
      .send({
        quantity: 2,
        token: `${token}`
      })
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('Order modified successfully!');
        done();
      });
  });
  it('should be able to delete order', (done) => {
    supertest(app)
      .delete(`/order/${orderId}`)
      .send({
        token: `${token}`
      })
      .expect(401)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('Order deleted successfully!');
        done();
      });
  });
  it('should not get all orders if not admin', (done) => {
    supertest(app)
      .get('/admin/orders')
      .send({
        token: `${token}`
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('You do not have access to perform this action');
        done();
      });
  });
  it('should get all orders if admin', (done) => {
    supertest(app)
      .get('/admin/orders')
      .send({
        token: `${otherToken}`
      })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body);
        done();
      });
  });
  it('should be able to update order status when logged in as admin', (done) => {
    supertest(app)
      .put('/admin/orders/:orderId')
      .send({
        status: 'accept',
        token: `${otherToken}`
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
  it('should be able to update order status when logged in as user', (done) => {
    supertest(app)
      .put('/admin/orders/:orderId')
      .send({
        status: 'accept',
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
  it('should not show orders on the next page', (done) => {
    supertest(app)
      .get('/admin/orders?page=2')
      .send({
        token: `${otherToken}`
      })
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body.message).toBe('Sorry no food order for this page');
        done();
      });
  });
  it('should not be able to get food if no food', (done) => {
    supertest(app)
      .get('/admin/orders')
      .send({
        token: `${otherToken}`
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
