const inquirer = require('inquirer');
const connection = require('./connection');
const findEvents = require('./eventfulAPI.js');


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
        message: 'What\'s your email?',
        name: 'email'
      }]).then((res)=> {
        var post = {name: res.name, age: res.age, email: res.email};
        connection.query('INSERT INTO Users SET ?', post, (err, results, fields) => {
          if(err){
            throw err;
          }
        })
      }).then(continueCallback);
}

app.searchEventful = (continueCallback) => {
  inquirer.prompt({
    type: 'input',
    message: 'What kind of event?',
    name: 'event'
  }).then((res) => {
    findEvents(res.event, (eventList) => {
      inquirer.prompt({
        type: 'confirm',
        message: 'Would you like to save this event to the database?',
        name: "answer",
        default: false
      }).then((res) => {
        if(res.answer === true) {
          var post = eventList;
          connection.query("INSERT INTO Events SET ?", post, (err, results, fields) => {
            if(err) {
              throw err;
            }
          })
          continueCallback();
        } else {
          app.searchEventful(continueCallback);
        }
      });
    })
   })
  }
  

  app.matchUserWithEvent = (continueCallback) => {
    let userArrayList = [];
    let eventArrayList = [];
    connection.query('SELECT * FROM Users', function (err, results, fields) {
      let userList = JSON.parse(JSON.stringify(results));
      
      for(let i=0; i<userList.length; i++) {
        userArrayList.push(`${userList[i].user_id} || ${userList[i].email}`);
      }
      inquirer.prompt({
        type: 'list',
        name: 'uID',
        message: 'Which email would you like to selecT?',
        choices: userArrayList
      }).then((res) => {
        let grabUserID = res.uID.split('||');
        let userID = grabUserID[0];
  
        connection.query('SELECT * FROM Events', function(err, results, fields) {
          let eventsList = JSON.parse(JSON.stringify(results));
          
          for(let i=0; i<eventsList.length; i++){
            eventArrayList.push(`${eventsList[i].event_id} || ${eventsList[i].title}`)
          }
          inquirer.prompt({
            type: 'list',
            name: 'eID',
            message: "Which event would you like to attend?",
            choices: eventArrayList
          }).then((res) => {
            let grabEventID = res.eID.split('||');
            let eventID = grabEventID[0];
            
            let combineUserAndEvent = {user__id: userID, event__id: eventID};
            connection.query('INSERT INTO Users_Events SET ?', combineUserAndEvent, function(err, results, fields){
              if(err) throw err;
              console.log(`You are going to ${grabEventID[1]}!`);
              continueCallback();
            })
          })
        })
      })
    })
  }


  app.seeEventsOfOneUser = (continueCallback) => {
    let newArr = [];
    connection.query('SELECT user_id, email FROM Users', (err, rows)=>{
      for(let i=0; i<rows.length; i++){
        newArr.push(`${rows[i].user_id} || ${rows[i].email}`)
      }
    inquirer.prompt({
      type: 'list',
      message: 'Which users event do you want to see?',
      name: 'user',
      choices: newArr
      }).then((res) => {
      console.log('You are searching user ' + res.user);
      const userArr = res.user.split( ' || ');
      const userId = userArr[0];
      const userEmail = userArr[1];

      const eventQuery = 'SELECT * FROM Events JOIN Users_Events ON Events.event_id = Users_Events.event__id WHERE Users_Events.user__id = ?';

      connection.query(eventQuery, userId, function(err, result, fields) {
        if (err) throw err;

        if (result.length === 0) {
          console.log('No event found for ' + userEmail + '. Please try another user.');
          app.seeEventsOfOneUser(continueCallback);
        }
        else {
          console.log(userEmail + ' is going to the following event(s):');

          result.forEach(obj => {
            console.log(" -------------------------------------------------------- ");
            console.log('Name: ', obj.title);
            console.log('Venue: ', obj.venue);
            console.log('Address: ', obj.address);
          });
          continueCallback();
        }      
      });
    }).catch(err => {
      console.log(err);
    })
  })
}


app.seeUsersOfOneEvent = (continueCallback) => {
   
  let newArr = [];
  connection.query('SELECT event_id, title FROM Events', (err, rows)=>{
    for(let i=0; i<rows.length; i++){
      newArr.push(`${rows[i].event_id} || ${rows[i].title}`)
    }
  inquirer.prompt({
    type: 'list',
    message: 'Which event do you want to see the user for?',
    name: 'event',
    choices: newArr
    }).then((res) => {
    console.log('You are searching this event\'s users: ' + res.event);
    const eventArr = res.event.split( ' || ');
    const eventId = eventArr[0];
    const eventName = eventArr[1];

    const eventQuery = 'select name, email from Users JOIN Users_Events ON Users_Events.user__id = Users.user_id WHERE Users_Events.event__id = ?';

    connection.query(eventQuery, eventId, function(err, result, fields) {
      if (err) throw err;

      if (result.length === 0) {
        console.log('No  users found for ' + eventName + '. Please try another event.');
        app.seeUsersOfOneEvent(continueCallback);
      }
      else {
        console.log(eventName + ' is being attended by the following person(s): ');

        result.forEach(obj => {
          console.log(" -------------------------------------------------------- ");
          console.log('Email: ', obj.email);
          console.log('Name: ', obj.name);
          //console.log('Address: ', obj.address);
        });
        
        continueCallback();
      }      
    });
  }).catch(err => {
    console.log(err);
  })
})
}

module.exports = app;
