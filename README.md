<p align="center">
  Sedexo is a project to calculate quotes from different delivery services and calculate their metrics. :package: 
</p>

## Getting Started

### Docker approach  :whale:
_This method is not intended for development, it was built for production_

To run this project you will need docker installed on your machine. If you don't have it, you can download it [here](https://www.docker.com/get-started).
After installing docker, you need to clone this repository and create the `.env` file in the root, nestjs_backend and go_backend folder. You can copy the respective `.env.example` file, rename it to `.env` and fill it with proper information.
After creating and filling the env files on `./.env`, `./nestjs_backend/.env` and `./go_backend/.env`, you can run the following command in the root folder:

```bash
docker-compose up -d
```

This command will create a container the following containers with their ports exposed, if you didn't change the default ports:
- server: `nestjs_backend` - on port: `3333`
- server: `go_backend` - on port: `3334`
- database: `mariadb` - on port: `3306`
- proxy: `nginx` - on port: `80`

You can access the database with your favorite database manager, and try to send some http requests to the nginx proxy server, that will redirect the requests to the respective backend server using the `client.http` file in the root folder.


### Development approach

I recommend reading through the `README.md` file in each folder to run this application for development. It contains all the information necessary to run, develop and test each server implementation.


## Notes:

### Nestjs implementation:
- started at 2024-01-02
- finished at 2024-01-04

### Go implementation:
- started at 2024-01-05
- finished at TBD