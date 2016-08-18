var ENV_VARS

if (process.env.NODE_ENV !== "production") {
    ENV_VARS = {
        SERVER_URL: "http://localhost:4567"
    }
} else {
    ENV_VARS = {
        SERVER_URL: "https://api.exemplator.xyz"
    }
}

export default ENV_VARS