
FROM node:12-alpine
WORKDIR /usr/src/app
COPY package.json .
COPY . .
RUN npm install
# COPY .env.example .env.example
# COPY .env.local .env.local
CMD ["npm", "run", "dev"]