# How to reate a Postgres database for a application on the Fly.io

First you need to install fly.io, e.g., on Mac OS using homebrew:

    brew install flyctl

Second, you should create a Fly.io account: https://fly.io/docs/hands-on/sign-up/

    fky auth signup

Then you can log in to fly.io:

    fly auth login

Then you can create an app:

    fly launch

In our example, we will create a Fly app with PostgreSQL database, using the following command:

    flyctl postgres create

More information on how to create a fly.io app can be found here: https://fullstackopen.com/en/part3/deploying_app_to_internet
Or on fly.io website: https://fly.io/docs/postgres/postgres-on-nomad/

After the app is created, you shoud store the credentials from the terminal, which looks something like:

    Postgres cluster fs-psql-lecture-part13 created
    Username: postgres
    Password: nrPxndBN5hKJrkj
    Hostname: fs-psql-lecture-part13.internal
    Flycast: fdaa:0:f1d7:0:1::2
    Proxy port: 5432
    Postgres port: 5433
    Connection string: postgres://postgres:nrPxndBN5hKJrkj@fs-psql-lecture-part13.flycast:5432

Then connect Postgres database to your fly app:

    fly postgres connect -a <your-fly-app-name>

After the connect, you can start creating a table and insert rows into the table. Type in the following after "postgres=#" :

    CREATE TABLE notes (id SERIAL PRIMARY KEY, content text NOT NULL, important boolean, date time)

Then check if the table is created:

    \d

Or:

    \d notes

You can find more commands in postgresql: List commands in Postgresql: https://www.postgresql.org/docs/9.1/sql-commands.html

# How to reate a Postgres database for a application on the Docker

Start Postgres Docker image with the command:

    docker run -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 postgres

The command above must be left running while the database is used.

While the docker image of postgres is running, open another terminal and check the ID of running container:

    docker ps

The console will print the following content, which contains the ID of the container:

    ❯ docker ps
    CONTAINER ID   IMAGE      COMMAND                  CREATED          STATUS          PORTS                    NAMES
    0f4db45752a7   postgres   "docker-entrypoint.s…"   32 seconds ago   Up 31 seconds   0.0.0.0:5432->5432/tcp   dazzling_driscoll

Then connect to the database based on the ID:

    docker exec -it b461a9449b21 psql -U postgres postgres

Lastly, you can interact with the databse by create a table and insert row.

In this app, we use fly.io + postgresSQL.

# Node application using a relational database

Firstly, we create a new node.js application:

    npm init

Then install nodemon as dev-dependency:

    npm install --save-dev nodemon

Then install other dependencies:

    npm install express dotenv pg sequelize

Then create a .env file in the root of your repository, and add the following variables:

    DATABASE_URL = postgres://postgres:<password>@127.0.0.1:5432/postgres

If you use Docker, the DATABASE_URL should look like:

    DATABASE_URL = postgres://postgres:<password>@localhost:5432/postgres

Then create a gitignore file and add "node_modules", ".env" files to it.

Create a index.js file and add the following content:

    require('dotenv').config()
    const { Sequelize } = require('sequelize')

    const sequelize = new Sequelize(process.env.DATABASE_URL)

    const main = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully.')
        sequelize.close()
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
    }

    main()

When using Fly.io, the local connection to the database should first be enabled by tunneling the localhost port 5432 to the Fly.io database port using the following command:

    flyctl proxy 5432 -a <app-name>-db

In this case, the command is:

    flyctl proxy 5432 -a fs-psql-lecture-part13

While the Fly.io app is connecting to the database and connect string has been set up in the .env file, we can open another terminal and test for a connection:

    node index.js
