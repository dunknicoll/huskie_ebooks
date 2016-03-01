import 'babel-polyfill';
import config from 'config';
import Twitter from 'twitter';
import moment from 'moment-timezone';
import fs from 'fs';
import Log from 'log';
import { CronJob } from 'cron';


const log = new Log('clock', fs.createWriteStream('clock.log', { flags: 'a' }));
const job = {
  cronTime: '',
  onTick: () => {},
  start: true,
  timeZone: 'Europe/London'
};

const pals = config.get("usernames");
const lunchChat = config.get("lunchChat");
const huskie = config.get("huskie");

const debug = false;

function sendMessage(message) {
  log.info("Running");

  if(!debug){
    let twitterConfig = config.get("twitter");
    let client = new Twitter(twitterConfig);
    client.post('statuses/update', { status: message },
      (error, tweet, response) => {
        if (error) {
          log.error(error);
        } else {
          log.info(message);
        }
    });
  } else {
    console.log(message);
  }
}

function bangMessage() {
  let hour = moment().tz("Europe/London").format('h');
  let bangString = Array.from({ length: hour }, x => "bang!").join(" ");
  sendMessage(bangString);
}

function doubleAct() {
  let randomPal = pals[Math.floor(Math.random()*pals.length)];
  let palString = `Right ${randomPal}, you and me the old double act. ${huskie}`
  sendMessage(palString);
}

function postLunch() {
  let randomChat = lunchChat[Math.floor(Math.random()*lunchChat.length)];
  sendMessage(randomChat);
}

function main() {

  let hourlyJobSettings = {...job};
  hourlyJobSettings.cronTime = '00 00 * * * *';
  hourlyJobSettings.onTick = bangMessage;

  let morningSettings = {...job};
  morningSettings.cronTime = '00 15 09 * * 1-5';
  morningSettings.onTick = () => { sendMessage("Nice of you to join us") };
  
  let lunchSettings = {...job};
  lunchSettings.cronTime = '00 30 13 * * 1-5';
  lunchSettings.onTick = postLunch;

  let afternoonSettings = {...job};
  afternoonSettings.cronTime = '00 30 14 * * 1-5';
  afternoonSettings.onTick = doubleAct;

  let fridaySettings = {...job};
  fridaySettings.cronTime = '00 00 17 * * 5';
  fridaySettings.onTick = () => { sendMessage("Down tools lads") };

  let monThursSettings = {...job};
  monThursSettings.cronTime = '00 30 17 * * 1-4';
  monThursSettings.onTick = () => { sendMessage("Boom ting!") };

  let hourlyJob = new CronJob(hourlyJobSettings);
  let morningJob = new CronJob(morningSettings);
  let lunchJob = new CronJob(lunchSettings);
  let afternoonJob = new CronJob(afternoonSettings);
  let fridayJob = new CronJob(fridaySettings);
  let monThursJob = new CronJob(monThursSettings);

}

main();
