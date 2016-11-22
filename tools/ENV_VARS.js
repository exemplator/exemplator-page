var ENV_VARS

if (process.env.NODE_ENV !== "production") {
    ENV_VARS = {
        SERVER_URL: "http://localhost:4567"
    }
} else {
    ENV_VARS = {
        SERVER_URL: "${SERVER_URL}"
    }
}

export default ENV_VARS