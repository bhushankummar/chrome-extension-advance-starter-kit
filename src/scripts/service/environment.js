
const env = 'local';
// const env = 'production';

const localEnv = {
    API_URL: 'http://localhost:8080/'
};

const productionEnv = {
    API_URL: 'http://localhost:8080/'
};

export let environment = {
    API_URL: localEnv
};

switch (env) {
    case 'local':
        environment = localEnv;
        break;

    case 'production':
        environment = productionEnv;
        break;

    default:
        environment = localEnv;
        console.log('Un-matched env');
}
