import 'babel-polyfill';
import config from 'config';
import Twitter from 'twitter';
import moment from 'moment-timezone';
import fs from 'fs';
import Log from 'log';

const log = new Log('clock', fs.createWriteStream('clock.log', { flags: 'a' }));

function announce () {
    let hourCheck = moment().tz("Europe/London").format('HH');
    let minuteCheck = moment().tz("Europe/London").format('mm');
    let timeCheck = hourCheck + ":" + minuteCheck;
    let dayCheck = moment().tz("Europe/London").day();

    if (dayCheck != 0 && dayCheck != 6) {

        if(timeCheck=="09:15"){
            sendMessage("Nice of you to join us");
        }

        if(timeCheck=="17:00" && dayCheck==5) {
            sendMessage("Down tools lads");
        } else if(timeCheck=="17:30" && dayCheck!=5) {
            sendMessage("Boom ting!")
        }
    }

    if(minuteCheck=="00"){
        let hour = moment().tz("Europe/London").format('h');
        let bangString = Array.from({length: hour}, x => "bang!").join(" "); 
        sendMessage(bangString);
    }
}

function sendMessage(message) {
    let twitterConfig = config.get("twitter");
    let client = new Twitter(twitterConfig);
    client.post('statuses/update', {status: message},  (error, tweet, response) => {
      if(error) {
        log.error(error);
      } else {
        log.info(message);
      }
    });
}

announce();
