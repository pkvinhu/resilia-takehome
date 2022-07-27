# Resilia Take Home – Notifications Mini-System

## Instructions
Build a simple app that displays a list of notifications on a web page. The payload of the notification is arbitrary (pick a simple domain based on what you know about our customers) but the attributes that allow it to function as a notification should make sense.

The purpose of this is to not spend a lot of time building a perfect, scalable and impressive system, but to use the tools you’re comfortable with building a basic solution to the prompt above; one that you can walk me through in detail. We’ll walk through it in person, and expand
upon it onsite.

## Requirements
- frontend should request notifications from an API
- notifications should be housed in a persistent store
- persistent store that can survive the API server restarting
- notification objects contain arbitrary domain data along with attributes that allow it to function as a “notification” a user is intended to receive

## Assumptions
- the app’s user - the recipient of the notification - is not the creator/author
- 1-4 hours, max

## Setup
1. Make sure [NodeJS](https://nodejs.org/en/download/) is installed in your system
2. Run `npm i --save` to install node dependencies
3. `touch .env` to add environment file and add key `cookieKey` into the file

## Run
1. Run `npm start` to start server (app served on `localhost:3000` or custom `PORT` variable in your environment file)
