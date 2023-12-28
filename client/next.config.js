module.exports = {
    webpackDevMiddleware: config => {
        config.watchOptions.poll = 200;
        return config;
    }
};