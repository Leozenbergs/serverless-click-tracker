'use strict';

module.exports.handler = async (event, context) => {
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
  return response;
  
}