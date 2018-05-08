const eventfulKey = require("./keys.js").eventful;
const eventful = require('eventful-node');
const client = new eventful.Client(eventfulKey);

// //sample search, try running it to see it in action
// client.searchEvents({
//   keywords: 'tango',
//   location: 'San Francisco',
//   date: "Next Week"
// }, function(err, data){
//    if(err){
//      return console.error(err);
//    }
//    let resultEvents = data.search.events.event;
//    console.log('Received ' + data.search.total_items + ' events');
//    console.log('Event listings: ');
//    for ( let i =0 ; i < resultEvents.length; i++){
//      console.log("===========================================================");
//      console.log('title: ',resultEvents[i].title);
//      console.log('start_time: ',resultEvents[i].start_time);
//      console.log('venue_name: ',resultEvents[i].venue_name);
//      console.log('venue_address: ',resultEvents[i].venue_address);
//    }
// });


//sample function
function findEvents(keyword){
  client.searchEvents({
    keywords: keyword,
}, function(err, data){
     if(err){
       return console.error(err);
   }
   let resultEvents = data.search.events.event;
   console.log('Received ' + data.search.total_items + ' events');
   console.log('Event listings: ');
   console.log('title: ',resultEvents[i].title);
});
}


module.exports = findEvents;

