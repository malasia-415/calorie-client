"use strict";

const dotenv = require( "dotenv" );
const Hapi = require( "@hapi/hapi" );

const plugins = require( "./plugins" );
const routes = require( "./routes" );

//The createServer() function creates an instance of the hapi server based on the 
//port and host environment variables, which are configured in the .env file.
const createServer = async () => {
  const server = Hapi.server( {
    port: process.env.PORT || 8080,
    host: process.env.HOST || "localhost"
  } );

  await plugins.register( server );

  server.route( routes );

  return server;
};

//the init() function uses dotenv to read in the .env configuration file, creates the 
//web server, starts the server, and outputs the address of the web server
const init = async () => {
  dotenv.config();
  const server = await createServer();
  await server.start();
  console.log( "Server running on %s", server.info.uri );
};

//event handler for unhandledRejection in case an exception occurs anywhere in the 
//application that doesn't have error handling, which outputs the error and shuts down the server.
process.on( "unhandledRejection", ( err ) => {
  console.log( err );
  process.exit( 1 );
} );

init();