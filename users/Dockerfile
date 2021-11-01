FROM node:14.8.0-alpine
RUN npm install -g npm@6.14.7
RUN mkdir -p /var/www/users
WORKDIR /var/www/users
ADD . /var/www/users
RUN npm install
CMD npm run build && npm run start:prod
