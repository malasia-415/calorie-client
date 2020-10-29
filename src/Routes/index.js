"use strict";

//which returns the text "hello world!" The module exports an array of routes
const home = {
  method: "GET",
  path: "/",
  handler: ( request, h ) => {
    return "hello world!, I will be rich!";
  }
};

module.exports = [ home ];