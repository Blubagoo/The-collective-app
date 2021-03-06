'use strict';

const { TEST_DATABASE_URL, TEST_PORT } = require('../config');
process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const { app, runServer, closeServer } = require('../index');
const { User } = require('../users');
const { JWT_SECRET } = require('../config');
const expect = chai.expect;
chai.use(chaiHttp);

describe('Auth endpoints', function () {
  const username = 'User';
  const password = 'examplePass';
  const firstName = 'Joe';
  const lastName = 'Schmoe';
  const email = 'joe@gmail.com';

  before(function () {
    
    return runServer(TEST_DATABASE_URL, TEST_PORT);
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function () {
    return User.hashPassword(password).then(password =>
      User.create({ username, password, firstName, lastName, email })
    );
  });

  afterEach(function () {
    return User.remove({});
  });

  describe('/api/auth/login', function () {

    it('Should reject requests with no credentials', function () {
      return chai
        .request(app)
        .post('/api/auth/login')
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(401);
        });
    });

    it('Should reject requests with incorrect usernames', function () {
      return chai
        .request(app)
        .post('/api/auth/login')
        .auth('wrongUsername', password)
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(401);
        });
    });

    it('Should reject requests with incorrect passwords', function () {
      return chai
        .request(app)
        .post('/api/auth/login')
        .auth(username, 'wrongPassword')
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(401);
        });
    });

    it('Should return a valid auth token', function () {
      return chai
        .request(app)
        .post('/api/auth/login')
        .auth(username, password)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          const token = res.body.authToken;
          expect(token).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256']
          });
          expect(payload.user.username).to.equal(username);
          expect(payload.user.firstName).to.equal(firstName);
          expect(payload.user.lastName).to.equal(lastName);
        });
    });
  });

  describe('/api/auth/refresh', function () {

    it('Should reject requests with no credentials', function () {
      return chai
        .request(app)
        .post('/api/auth/refresh')
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it('Should reject requests with an invalid token', function () {
      const token = jwt.sign(
        { username },
        'wrongSecret',
        {
          expiresIn: '7d'
        }
      );
      return chai
        .request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
          const res = err.response;
          expect(res).to.have.status(401);
        });
    });

    it('Should reject requests with an expired token', function () {
      const token = jwt.sign(
        {
          user: { username },
          exp: Math.floor(Date.now() / 1000) - 10
        },
        JWT_SECRET,
        {
          subject: username
        }
      );
      return chai
        .request(app)
        .post('/api/auth/refresh')
        .set('authorization', `Bearer ${token}`)
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });

    it('Should return a valid auth token with a newer expiry date', function () {
      const token = jwt.sign(
        {
          user: { username }
        },
        JWT_SECRET,
        {
          subject: username,
          expiresIn: '7d'
        }
      );
      const decoded = jwt.decode(token);
      return chai
        .request(app)
        .post('/api/auth/refresh')
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          const token = res.body.authToken;
          expect(token).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
          });
          expect(payload.user).to.deep.equal({ username });
          expect(payload.exp).to.be.at.least(decoded.exp);
        });
    });
  });
});
