
const env = 'local';
// const env = 'production';

const localEnv = {
    API_URL: 'http://localhost:4050/'
};

const productionEnv = {
    API_URL: 'http://localhost:4050/'
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
