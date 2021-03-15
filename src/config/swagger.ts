import swaggerJSDoc from 'swagger-jsdoc';
import { BACKEND_HOST } from './vars';
const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: 'ARFXHome API Endpoints',
            version: '1.0.0',
            description: 'A simple API Endpoints for ARFXHome app.',
        },
        host: `${BACKEND_HOST}`,
        basePath: '/v1',
    },
    apis: [
        './dist/api/routes/**/*.js',
        './swagger/**/*.yml',
    ],
};
export default swaggerJSDoc(options);