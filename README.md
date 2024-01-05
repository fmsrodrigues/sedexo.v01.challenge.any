<p align="center">
  Sedexo is a project to calculate quotes from different delivery services and calculate their metrics. :package: 
</p>

## Getting Started

### Docker approach  :whale:
_This method is not intended for development, it was built for production_

To run this project you will need docker installed on your machine. If you don't have it, you can download it [here](https://www.docker.com/get-started).
After installing docker, you need to clone this repository and create the `.env` file in the root and nestjs_backend folder. You can copy the respective `.env.example` file, rename it to `.env` and fill it with proper information.
After creating and filling the env files on `./.env` and `./nestjs_backend/.env`, you can run the following command in the root folder:

```bash
docker-compose up -d
```

This command will create a container with the backend and another container with the database.

After that you can access the backend at `http://localhost:3333` or in the port that you set on the `.env` file. The database is also mapped to your machine, so you can access it with your favorite database manager.

### Development approach

I recommend reading through the `README.md` file in each folder to run this application for development. It contains all the information necessary to run, develop and test each server implementation.


## Notes:

### Nestjs implementation:
- started at 2024-01-02
- finished at 2024-01-04

### Go implementation:
- started at 2024-01-05
- finished at TBD