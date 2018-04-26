'use strict';

const { app, runServer, closeServer } = require('./server');
const { User } = require('./users');

const faker = require('faker');

const fakeUsers = [];    

const userCt = 10;


function fakeUser() {
  return {
    username : faker.internet.userName(),
    password : faker.internet.password(),
    firstName : faker.name.firstName(),
    lastName : faker.name.lastName(),
    email : faker.internet.email(),
  };
}


    
 runServer()
  .then(() => {
    return User.remove({});
  }) 
  .then(()=>{
    for (let i=0; i<userCt; i++){
      fakeUsers.push(fakeUser());
    }
    return User.insertMany(fakeUsers);
  })
  .then(users => {
    return userIds = users.map(user => {
      return user._id;
    });
  })
  .then(()=>{
    return closeServer();        
  });