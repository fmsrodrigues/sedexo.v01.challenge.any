## Running the server

To run this application server you will first need docker installed on your machine. If you don't have it, you can download it [here](https://www.docker.com/get-started). You will also need go installed on your machine. You can download it [here](https://golang.org/dl/).
After installing docker, you need to clone this repository and create the `.env` file in go_backend folder. You can copy the `.env.example` file, rename it to `.env` and fill it with proper information.
After creating and filling the env file on `./go_backend/.env`, you can run the following commands in the go_backend folder:

```bash
  docker-compose up -d
  go mod download
  go run ,/cmd/web
```

Now you can access the backend at `http://localhost:3334` or in the port that you set on the `.env` file. The database is also mapped to your machine, so you can access it with your favorite database manager.

You can also run some http requests using the REST client extension for vscode. You can find the requests in the `./go_backend/client.http` file.

## Running the tests

To run the tests you can run the following command in the go_backend folder:

```bash
  go test
```