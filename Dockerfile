FROM node:6-slim

WORKDIR /root/app

ADD package.json package.json
RUN npm install
ADD typescript_def/ typescript_def/
ADD typings.json typings.json
RUN npm run typings

ADD . .

RUN npm run tsc

EXPOSE 9000 

CMD ["node", "server"]
