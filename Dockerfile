FROM node
MAINTAINER wyvernnot <wyvernnot@gmail.com>
COPY package.json package.json
RUN npm install
ENV ab-docker_PORT 80
ENV ad-docker_ADMIN_PORT 3000
COPY . .
EXPOSE 80
EXPOSE 3000
CMD ["npm","run-script","start"]