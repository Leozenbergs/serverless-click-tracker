'use strict';

const { DynamoDB } = require("aws-sdk")

const db = new DynamoDB.DocumentClient()
const TableName = process.env.TABLE

module.exports.handler = async (event) => {
  const clicks = await db
    .scan({
      TableName,
    })
    .promise()

  return { statusCode: 200, body: JSON.stringify(clicks) }
};