"use strict";

const boom = require( "@hapi/boom" );
const joi = require( "@hapi/joi" );

// add a new measurement for the current user
const addMeasurementForCurrentUser = {
  method: "POST",
  path: "/api/measurements",
  handler: async ( request, h ) => {
    try {
      if ( !request.auth.isAuthenticated ) {
        return boom.unauthorized();
      }
      const userId = request.auth.credentials.profile.id;
      const { measureDate, weight } = request.payload;
      const res = await h.sql`INSERT INTO measurements
        ( user_id, measure_date, weight )
        VALUES
        ( ${ userId }, ${ measureDate }, ${ weight } )

        RETURNING
            id
            , measure_date AS "measureDate"
            , weight`;
      return res.count > 0 ? res[0] : boom.badRequest();
    } catch ( err ) {
      console.log( err );
      return boom.serverUnavailable();
    }
  },

  options: {
    auth: { mode: "try" },
    validate: {
      payload: joi.object( {
        measureDate: joi.date(),
        weight: joi.number()
      } )
    }
  }
};

// retrieve all measurements for the current user
const allMeasurementsForCurrentUser = {
    method: "GET",
    path: "/api/measurements",
    handler: async ( request, h ) => {
      try {
        if ( !request.auth.isAuthenticated ) {
          return boom.unauthorized();
        }