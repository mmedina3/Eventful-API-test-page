const eventfulKey = require("./keys.js").eventful;
const eventful = require('eventful-node');
const client = new eventful.Client(eventfulKey);
const searchEventful = require('./app.js');
const inquirer = require('inquirer');
const continueCallback = require('./app');

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

module.exports =  findEvents;
