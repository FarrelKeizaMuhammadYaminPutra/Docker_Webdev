import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config({path: '../../.env' });

//const client = new MailtrapClient({
  //endpoint:  process.env.MAILTRAP_ENDPOINT,
  //token:  process.env.MAILTRAP_TOKEN,
//});

//const recipients = [
  //{
    //email: "enderisgod96@gmail.com",
  //},
//]


export const mailtrapClient = new MailtrapClient({
  endpoint:  "https://send.api.mailtrap.io/",
  token:  "de869588cb715776ed3b1fd242230c4a",
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "The Films",
};



//client
  //.send({
    //from: sender,
    //to: recipients,
    //subject: "You are awesome!",
    //text: "Congrats for sending test email with Mailtrap!",
    //category: "Integration Test",
  //})
  //.then(console.log, console.error);

