let ENV_VARS

const SERVER_URL_PROD = "${SERVER_URL}"

if (process.env.NODE_ENV !== "production" || !isProdUrl(SERVER_URL_PROD)) {
  console.log("Dev variables chosen")
  ENV_VARS = {
    SERVER_URL: "http://localhost:4567"
  }
} else {
  ENV_VARS = {
    SERVER_URL: SERVER_URL_PROD
  }
}

export default ENV_VARS

// Checks if docker replaced url correctly, otherwise jump back to dev
function isProdUrl(url) {
  return !url.startsWith('$')
}