var https = require('https');
var express = require('express');
var Webtask = require('webtask-tools');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.post('/', function(req, res) {
  //User didn't supply content to send.
  if (!req.body.message) {
    res.status(400).send('Missing message to send.');
    //Send data to specified apps.
  } else {
    //Discord Info.
    const discordHost = 'discordapp.com';
    const discordPath =
      '/api/webhooks/' +
      req.webtaskContext.secrets.discordWebhook +
      '/' +
      req.webtaskContext.secrets.discordToken;

    //Slack Info.
    const slackHost = 'hooks.slack.com';
    const slackPath =
      '/services/' +
      req.webtaskContext.secrets.slackService +
      '/' +
      req.webtaskContext.secrets.slackWebhook +
      '/' +
      req.webtaskContext.secrets.slackToken;

    //Shared Info.
    const method = 'POST';
    const headers = { 'Content-Type': 'application/json' };

    //Prepare data.
    const discordData = JSON.stringify({
      content: req.body.message,
    });

    const slackData = JSON.stringify({
      text: req.body.message,
    });

    //Prepare options for two requests.
    const discordOptions = {
      hostname: discordHost,
      path: discordPath,
      method: method,
      headers: headers,
    };

    const slackOptions = {
      hostname: slackHost,
      path: slackPath,
      method: method,
      headers: headers,
    };

    //Chain requests and throw statusMessage if one of statusCodes are faulty.
    const discordRequest = https.request(discordOptions, discordResult => {
      const slackRequest = https.request(slackOptions, slackResult => {
        if (discordResult.statusCode == 204 && slackResult.statusCode == 200) {
          res.status(200).send('Messages sent!');
        } else {
          res
            .status(500)
            .send(
              'Discord result: ' +
                discordResult.statusMessage +
                '\n' +
                'Slack result: ' +
                slackResult.statusMessage
            );
        }
      });

      slackRequest.write(slackData);
      slackRequest.end();
    });

    discordRequest.write(discordData);
    discordRequest.end();
  }
});

module.exports = Webtask.fromExpress(app);
