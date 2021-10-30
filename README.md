# Neutrino-api

This repository is a backend for [neutrino-chat](https://neutrino.chat/)

## Running with docker-compose

Execute

```shell
docker network create infrastructure
cp .env.example .env
docker-compose up -d
```

from the root of the repository

## Accessing the API itself and swagger docs for the API

- Once you launch the API it will be accessible on port 8000.
- RabbitMQ management will be accessible on port 15672
- MongoDB will be accessible on port 27017
- Swagger docs for the API will be accessible locally via URI "**<http://localhost:8000/api-docs/>**"

## Developing with docker-compose

To run development version execute following commands from the root of the repository

```shell
cp .env.example .env.test
```

Populate all necessary values in `.env.test` and copy it to **all subfolders**. Next run following commands to start docker-compose.

```shell
docker-compose -f docker-compose.test.yml up --build
```

and to stop the service run

```shell
docker-compose down --remove-orphans
```

Please note that nothing is persisted in development version between service restarts.

## Brief architecture overview

This API showcase consists of the following parts:

- API gateway
- Auth service - responsible for creating, decoding, destroying JWT tokens for users
- User service - responsible for CRUD operations on users
- Permission service - responsible for verifying permissions for logged in users.
- Devices service - responsible for CRUD operations on users devices
- The service interact via **RabbitMQ message broker**
- MongoDB database - right now there is a single DB to store all the data but this will be addressed in the future to achieve greater scalability.
- RabbitMQ - message broker service that allow communication between services and that persists jobs in case of service failure
- Redis - used for caching for faster and less database heavy requests
