'use strict';

var _ = require('lodash/core');
const axios = require('axios');


const makeRequest = (url, params) => {
  const config = _.defaults(params, { method: 'get' }, { url: url })


  return axios(config)
    .then(response => {
      return _.pick(response, ["headers", "status", "statusText", "data"])
    })
    .catch(error => {
      return { errorCode: 6, message: "cannot retrieve url: " + error }
    })


}

module.exports.starsnowRequest = async event => {
  const body = JSON.parse(event.body);


  return await Promise.all(

    body.data.map((row) => makeRequest(row[1], row[2]))

  ).then((ret) => {

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          data: ret.map((v, idx) => [idx, v])
        }
      )
    }

  }).catch(error => {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    }
  })

}

module.exports.starsnowRequestGet = async event => {
  const body = JSON.parse(event.body);


  return await Promise.all(

    body.data.map((row) => makeRequest(row[1], {}))

  ).then((ret) => {

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          data: ret.map((v, idx) => [idx, v.data])
        },
      )
    }

  }).catch(error => {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    }
  })

}
