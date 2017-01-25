var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
  res.send('This is 2626 Creative Studio Server for FB page.');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'creativestudio_verify_token') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Invalid verify token');
  }
});

// handler receiving messages
app.post('/webhook', function (req, res) {
  getStartMessage();
  welcomeMessage();
  var events = req.body.entry[0].messaging;
  for (i = 0; i < events.length; i++) {
    var event = events[i];
    if (event.message && event.message.text) {
      sendMessage(event.sender.id);
    }
  }
  res.sendStatus(200);
});

// generic function sending messages
function getStartMessage() {
  console.log('aaaaaaaa');
  request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: {
      setting_type: "call_to_actions",
      thread_state: "new_thread",
      call_to_actions: [
        {
          payload: "USER_DEFINED_PAYLOAD"
        }
      ]
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
};

function welcomeMessage() {
  console.log('aaaaaaaa');
  request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: {
      setting_type: "greeting",
      greeting: {
        text: "Hi, {{user_first_name}}! It’s nice to meet you."
      }
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
};

function sendMessage(recipientId) {
  console.log('bbbbbbbbbb');
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: process.env.PAGE_ACCESS_TOKEN
    },
    method: 'POST',
    json: {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
               {
                 title: "Title",
                 subtitle: "subtitle",
                 image_url: "http://projects.2626.today/fbbot/welcome.jpg",
                 "buttons": [
                    {
                      "type": "web_url",
                      "url": "http://visit.2626.today/",
                      "title": "View Website"
                    }
                 ]
               }
            ]
          }
        }
      }
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}