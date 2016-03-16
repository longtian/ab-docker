FROM node
MAINTAINER wyvernnot <wyvernnot@gmail.com>
COPY package.json package.json
RUN npm install
COPY . .
EXPOSE 80
EXPOSE 3000
CMD ["npm","run-script","start"]