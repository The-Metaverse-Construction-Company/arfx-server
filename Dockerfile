
FROM node:12-alpine AS BUILDER
WORKDIR /usr/src/app
COPY package.json .
COPY . .
RUN npm i \
	&& npm run build
FROM node:12-alpine
WORKDIR /usr/src/app
COPY --from=BUILDER /usr/src/app/dist /usr/src/app/dist
COPY --from=BUILDER /usr/src/app/swagger /usr/src/app/swagger
COPY --from=BUILDER /usr/src/app/package.json /usr/src/app/
COPY --from=BUILDER /usr/src/app/package-lock.json /usr/src/app/
RUN npm ci --production
CMD ["npm", "run", "start"]
