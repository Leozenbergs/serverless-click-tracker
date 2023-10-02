const { DynamoDB } = require("aws-sdk")
const { v4: uuidv4 } = require('uuid');

const db = new DynamoDB.DocumentClient()
const TableName = process.env.CLICKS || 'dev-tracker'

module.exports.register = async (event, context, callback) => {
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

  if (typeof data.origin !== 'string') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t register click.',
    });
    return;
  }

  await db
    .put(params, (error) => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Couldn\'t register click.',
        });
        return;
      }
  
      // create a response
      const response = {
        statusCode: 200,
        body: JSON.stringify(params.Item),
      };
      callback(null, response);
    })
    .promise()

  return { statusCode: 200, body: JSON.stringify(registerClick), event: event }
};


module.exports.list = async (event) => {
  const clicks = await db
    .scan({
      TableName,
    })
    .promise()

  return { statusCode: 200, body: JSON.stringify(clicks) }
};

module.exports.serve = async (event, context, callback) => {
  const htmlResponse = (`
    <h1>Welcome To hyperlink auditingng</h1>
    
    <p>Follow one of the links below to generate data.</p>

    <p><button onclick="registerClick()">Home</button></p>
    <p><button onclick="registerClick()" target="_blank">Portfolio</button></p>
    <script>
      async function registerClick() {
        const res = await fetch("./register", {
          method: "POST",
          body: JSON.stringify({
            origin: window.origin
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        });

        const result = await res.json();
      }
    </script>
  `);

  const response = {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html",
    },
    body: htmlResponse,
  };
  // callback will send HTML back
  callback(null, response);
  
}