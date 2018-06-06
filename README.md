# TC CS-02 Competition

This is my submission for the CS-02 hackathon at Transport Canada.

# Setup

1. The application requires an up to date (version 8.x or later) version of [Node.js](https://nodejs.org/en/). Make sure to install it.
2. Create a file called `.env` and add the following line with the path to your Mongo Database:  
```
DB_CONN=mongodb://<path to your Mongo DB>
```
3. Run `npm install` to install the dependencies.
4. Run `node seed.js` to initialize the Mongo DB.
5. Run `npm start` to start the API server.
