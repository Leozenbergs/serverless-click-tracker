'use strict';

const { DynamoDB } = require("aws-sdk")
const { v4: uuidv4 } = require('uuid');

const db = new DynamoDB.DocumentClient()
const TableName = process.env.TABLE

module.exports.handler = async (event, context) => {
  const data = JSON.parse(event.body);
  const registerClick = {
    "id": uuidv4(),
    "origin": data.origin,
    "time": new Date().toLocaleTimeString(),
  }
  const params = {
    TableName,
    Item: registerClick,
  }

  if (!data.origin) {
    console.error('Validation Failed');
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t register click.',
    }
  }

  await db
    .put(params, (error) => {
      if (error) {
        console.error(error);
        return {
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t register click.',
        }
      }
  
      // create a response
      const response = {
        statusCode: 200,
        body: JSON.stringify(params.Item),
      };
      return response;
    })
    .promise()

  return { statusCode: 200, body: JSON.stringify(registerClick), event: event }
};
