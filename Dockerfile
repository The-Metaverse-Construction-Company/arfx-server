
FROM node:12-alpine as BUILDER
WORKDIR /usr/src/app
COPY package.json .
COPY . .
RUN npm install \
	&& npm run build
FROM arfxhome/node:12-alpine
WORKDIR /usr/src/app
COPY --from=BUILDER /usr/src/app/dist /usr/src/app/dist
COPY --from=BUILDER /usr/src/app/swagger /usr/src/app/swagger
COPY --from=BUILDER /usr/src/app/package.json /usr/src/app/
COPY --from=BUILDER /usr/src/app/package-lock.json /usr/src/app/
RUN npm ci --production
CMD ["npm", "run", "start"]
