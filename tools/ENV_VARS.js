var ENV_VARS

if (process.env.NODE_ENV !== "production") {
    ENV_VARS = {
        SERVER_URL: "{SERVER_URL}"
    }
} else {
    ENV_VARS = {
        SERVER_URL: "http://104.131.79.185:4567"
    }
}

export default ENV_VARS