var ENV_VARS

if (process.env.NODE_ENV !== "production") {
    ENV_VARS = {
        SERVER_URL: "https://api.exemplator.xyz"
    }
} else {
    ENV_VARS = {
        SERVER_URL: "${SERVER_URL}"
    }
}

export default ENV_VARS