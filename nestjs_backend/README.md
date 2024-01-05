## Running the server

To run this application server you will first need docker installed on your machine. If you don't have it, you can download it [here](https://www.docker.com/get-started). You will also need nodejs installed on your machine. If you don't have it, you can download it [here](https://nodejs.org/en/download/).
After installing docker, you need to clone this repository and create the `.env` file in nestjs_backend folder. You can copy the `.env.example` file, rename it to `.env` and fill it with proper information.
After creating and filling the env file on `./nestjs_backend/.env`, you can run the following commands in the nestjs_backend folder:

```bash
  docker-compose up -d
  npm install
  npx prisma migrate dev
  npm run start:dev
```

Now you can access the backend at `http://localhost:3333` or in the port that you set on the `.env` file. The database is also mapped to your machine, so you can access it with your favorite database manager.

You can also run some http requests using the REST client extension for vscode. You can find the requests in the `./nestjs_backend/client.http` file.

## Running the tests

To run the tests you can run the following command in the nestjs_backend folder:

Unit tests:
```bash
  npm run test
```

End-to-end tests:
```bash
  npm run test:e2e
```

All tests:
```bash
  npm run test:all
```