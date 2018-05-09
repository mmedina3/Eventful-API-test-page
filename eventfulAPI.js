const eventfulKey = require("./keys.js").eventful;
const eventful = require('eventful-node');
const client = new eventful.Client(eventfulKey);
const searchEventful = require('./app.js');
const inquirer = require('inquirer');
const continueCallback = require('./app');

//sample search, try running it to see it in action
function findEvents(keywords, callback){ 
  client.searchEvents({
  keywords: keywords,
  location: 'San Francisco',
  date: "Next Week"
}, function(err, data){
   if(err){
     return console.error(err);
   }
   let resultEvents = data.search.events.event;
   console.log('Received ' + data.search.total_items + ' events');
   console.log('Displaying first listing: ');
   
  let newTitle = resultEvents[0].title;
  let newStartTime = resultEvents[0].start_time;
  let newName = resultEvents[0].venue_name;
  let newAddress = resultEvents[0].venue_address;


   let eventList = {
     title: newTitle,
     start_time: newStartTime,
     venue: newName,
     address: newAddress
   }
     console.log('title: ', newTitle);
     console.log('start_time: ', newStartTime);
     console.log('venue_name: ', newName);
     console.log('venue_address: ', newAddress);

  callback(eventList);
  })
}
  //  inquirer.prompt({
  //    type: 'input',
  //    message: 'Would you like to save this event to the database?',
  //    name: "answer"
  //  }).then((res)=>{
  //    // var post = { name: res.name, age: res.age, gender: res.gender };
  //    var post = { title: resultEvents[i].title, start_time: resultEvents[i].start_time, venue: resultEvents[i].venue_name, address: resultEvents[i].venue_address };
  //    connection.query('INSERT INTO Events SET ?', post, (err, results, fields) => {
  //         if (err) {
  //           throw err;
  //         } 
  //       })
  //     }).then(continueCallback);



  // inquirer.prompt({
  //   type: 'input',
  //   message: 'What kind of event?',
  //   name: 'event'
  // }).then((res) => {
  //   findEvents(res.event);
  // })


//export a custom function that searches via Eventful API, displays the results AND stores some of the data into MySQL
module.exports =  findEvents;
