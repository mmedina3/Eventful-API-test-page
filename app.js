const inquirer = require('inquirer');
const connection = require('./connection');

const app = {};
app.startQuestion = (closeConnectionCallback) => {
  inquirer.prompt({
    type: 'list',
    message: 'What action would you like to do?',
    choices: [
      'Complete a sentence',
      'Create a new user',
      'Find one event of a particular type in San Francisco next week',
      'Mark an existing user to attend an event in database',
      'See all events that a particular user is going to',
      'See all the users that are going to a particular event',
      'Exit'
    ],
    name:'action',
  }).then((res) => {
    const continueCallback = () => app.startQuestion(closeConnectionCallback);

    if (res.action === 'Complete a sentence') app.completeSentence(continueCallback);
    if (res.action === 'Create a new user') app.createNewUser(continueCallback);
    if (res.action === 'Find one event of a particular type in San Francisco next week') app.searchEventful(continueCallback);
    if (res.action === 'Mark an existing user to attend an event in database') app.matchUserWithEvent(continueCallback);
    if (res.action === 'See all events that a particular user is going to') app.seeEventsOfOneUser(continueCallback);
    if (res.action === 'See all the users that are going to a particular event') app.seeUsersOfOneEvent(continueCallback);
    if (res.action === 'Exit') {
      closeConnectionCallback();
      return;
    }
  })
}

app.completeSentence = (continueCallback) => {
  inquirer.prompt([{
    type: 'input',
    message: 'What\'s your favorite color ?',
    name: 'color'
  }, {
      type: 'input',
      message: 'What\'s your favorite item ?',
      name: 'item'
    }]).then((res)=> {
      console.log('My favorite color is ' + res.color + ' , so my dream is to buy a ' + res.color + res.item + '.');
    }).then(continueCallback);
}

app.createNewUser = (continueCallback) => {
  inquirer.prompt([{
    type: 'input',
    message: 'What\'s your name?',
    name: 'name'
  }, {
      type: 'input',
      message: 'How old are you?',
      name: 'age'
    }, {
        type: 'input',
        message: 'What\'s your gender?',
        name: 'gender'
      }]).then((res)=> {
        var post = {name: res.name, age: res.age, gender: res.gender};
        connection.query('INSERT INTO Users SET ?', post, (err, results, fields) => {
          if(err){
            throw err;
          }
        })
      }).then(continueCallback);
}

app.searchEventful = (continueCallback) => {
  //YOUR WORK HERE

  console.log('Please write code for this function');
  //End of your work
  continueCallback();
}

app.matchUserWithEvent = (continueCallback) => {
  //YOUR WORK HERE

  console.log('Please write code for this function');
  //End of your work
  continueCallback();
}

app.seeEventsOfOneUser = (continueCallback) => {
  //YOUR WORK HERE

  console.log('Please write code for this function');
  //End of your work
  continueCallback();
}

app.seeUsersOfOneEvent = (continueCallback) => {
  //YOUR WORK HERE

  console.log('Please write code for this function');
  //End of your work
  continueCallback();
}

module.exports = app;


//delete this comment 