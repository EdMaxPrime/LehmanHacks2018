/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');
var http = require('http');
//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;

const SKILL_NAME = 'Space Facts';
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const makePlainText = Alexa.utils.TextUtils.makePlainText;
const makeImage = Alexa.utils.ImageUtils.makeImage;
const makeRichText = Alexa.utils.TextUtils.makeRichText;

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================


const listening = ["What can I do for you?", "Alexa, at your service!", "I'm listening..."];
const reprompt = "Anything else?";

const rain = ["It is certain to rain today.", "You should problably bring an umbrella today...", "It is likely to rain today."];
const fog = ["It's foggy outside.", "It may be difficult to see when driving.", "Visibility is low"];
const snow = ["It will snow today.", "There is a twenty percent chance of snow in the afternoon.", "Bundle up, there will be snow"];
const temp = ["Bundle up, temperatures will be below freezing.", "The average temperature today is nineteen degrees Celsius.", "The low today is zero degrees and the high will be seven degrees."]
//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================
var index = Math.floor(Math.random() * 3);

const handlers = {
    'LaunchRequest': function () {
        this.response.speak("Welcome to Alexa Sign Language!" + listening[Math.floor(Math.random() * listening.length)]);
        this.response.listen(reprompt);
        this.emit(":responseReady");
    },
    'TempIntent': function(){
        httpGet(temp[index], (theResult) => {
            console.log("sent     : " + temp[index]);
            console.log("received : " + theResult);
            
            if (supportsDisplay.call(this))
            {
                if (userNumber == 2)
                {
                    const bodyTemplate2 = new Alexa.templateBuilders.BodyTemplate2Builder();
                    
                    var template = bodyTemplate2.setTitle("Body Template 2 Title")
                                        .setTextContent(makePlainText(temp[index]))
                                        .setImage(makeImage(theResult))
                                        .build();
                                        
                    this.response.speak("Rendering Body Template 2")
                                        .renderTemplate(template)
                                        .shouldEndSession(null);
                    this.emit(":responseReady");
                }
            }
                                
            const speechOutput = theFact;
            this.response.speak(temp[index]);
            this.response.listen(reprompt);
            this.emit(":responseReady");
        });
    },
    'RainIntent': function (){
        this.response.speak(rain[index]);
        this.response.listen(reprompt);
        this.emit(":responseReady");
    },
    'SnowIntent': function (){
        this.response.speak(snow[index]);
        this.response.listen(reprompt);
        this.emit(":responseReady");
    },
    'FogIntent': function (){
        this.response.speak(fog[index]);
        this.response.listen(reprompt);
        this.emit(":responseReady");
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function httpGet(query, callback) {
    var options = {
        host: 'http:165.227.78.179',
        path: '/als/' + encodeURIComponent(query) + '.jpg',
        method: 'GET',
    };

    var req = http.request(options, res => {
        res.setEncoding('utf8');
        var responseString = "";
        
        //accept incoming data asynchronously
        res.on('data', chunk => {
            responseString = responseString + chunk;
        });
        
        //return the data when streaming is complete
        res.on('end', () => {
            console.log(responseString);
            callback(responseString);
        });

    });
    req.end();
}

function supportsDisplay() {
    var hasDisplay =
    this.event.context &&
    this.event.context.System &&
    this.event.context.System.device &&
    this.event.context.System.device.supportedInterfaces &&
    this.event.context.System.device.supportedInterfaces.Display

    return hasDisplay;
}
