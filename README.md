# Interactive API Docs (Swagger)
all of endpoint will be accessible here.
~~~~
${BACKEND_HOST}/api-docs
~~~~
# install the dependencies
`npm install`

# Run Integration Test
`npm run docker:test:integration`
# Build the image
`npm run docker:build`
# Deploy the image
`npm run docker:deploy`
# Build and deploy the image
`npm run docker:deploy:build`
# Run Integration Test,build, and deploy the image
`npm run docker:test:deploy:build`