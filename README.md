# webtask-chat-integration

This project serves as an example of what could be done using webtask.io. In this case, a file has been set up that can handle sending out messages to multiple platforms, in this case Discord and Slack.
Secrets were provided to address the specific tokens for needed webhooks and services. 

In future versions, a user could potentially create and edit these on the fly from the terminal to send out updates to a list of communication services, all at once.

Example POST body to send to webtask:
```
{
     "message": "Testing Slack and Discord mass message!"
}
```