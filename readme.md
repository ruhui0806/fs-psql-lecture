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
    Password: <your-password-here>
    Hostname: fs-psql-lecture-part13.internal
    Flycast: fdaa:0:f1d7:0:1::2
    Proxy port: 5432
    Postgres port: 5433
    Connection string: postgres://postgres:<your-password-here>@fs-psql-lecture-part13.flycast:5432

Then connect Postgres database to your fly app:

    fly postgres connect -a <your-fly-app-name>

After the connect, you can start creating a table and insert rows into the table. Type in the following after "postgres=#" :

    CREATE TABLE notes (id SERIAL PRIMARY KEY, content text NOT NULL, important boolean, date time);

    INSERT INTO notes (content, important) VALUES ('Relational databases rule the world', true);

    INSERT INTO notes (content, important) VALUES ('MongoDB is webscale', false);

Note: the psql command should end with a semicolon ";";
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

Create a index.js file and configure the sequelize connection to it.

When using Fly.io, the local connection to the database should first be enabled by tunneling the localhost port 5432 to the Fly.io database port using the following command:

    flyctl proxy 5432 -a <postgresql-app-name-in-fly.io>

In this case, the command is:

    flyctl proxy 5432 -a fs-psql-lecture-part13

While the Fly.io app is connecting to the database and connect string has been set up in the .env file, we can open another terminal and test for a connection:

    node index.js

## Core Concepts of Sequelize

https://sequelize.org/docs/v6/category/core-concepts/
https://www.postgresql.org/docs/9.1/sql-commands.html
https://www.postgresql.org/docs/15/index.html
https://sequelize.org/docs/v6/other-topics/query-interface/

# Migrations

Migration is a js file that defines the modifications to a database. A migration file defines the functions up and down. Up function defines how the database is updated (modified). Down function defines how to undo the migration if needed.

In migration, the column and table names are written in snake case form, e.g., user_id, while models name use camelCase.

Changes are defined by calling the queryInterface object methods:
https://sequelize.org/docs/v6/other-topics/query-interface/

https://sequelize.org/api/v6/class/src/dialects/abstract/query-interface.js~queryinterface

The migration files should be stored alphabetically, so that newer changes are always after previous changes. Here we name it with the date adn a sequence number, e.g., migrations/20230612_00_initialize_notes_and_users.js

## Run the migrations file

Option 1: from command line using "Sequelize command line tool (CLI)": https://sequelize.org/docs/v6/other-topics/migrations/

    npm install --save-dev sequelize-cli

Option 2: use Umzug library: https://github.com/sequelize/umzug

    npm install umzug

Note: So in migrations, the names of the tables and columns are written exactly as they appear in the database (snake_case_form), while models use Sequelize's default camelCase naming convention.

Note: the local connection to the database should also be left to running if you are trying to migration down (undo the migrations).

### Naming convention

For tables and columns:

<li> In Model files:  Sequelize's default camelCase naming convention, e.g., userId.
<li> In migration files: snake-case form, e.g.,: user_id.

Migration file names should always be named alphabetically when created so that previous changes are always before newer changes. One good way to achieve this order is to start the migration file name with the date and a sequence number.

## Many-to-Many relationship

In this app, a user can join many teams, and a team has many users, which is a typical type of many-to-many relationship.

A traditional way to implement many-to-many relationships is to create a "connection table", or so-called "through table". As for this app, the connection table is named as "Membership". In the memebership table, it has paired "userId-teamId" columns.

So the relationships between user and team and membership is as follows:

User <-- Membership --> Team

# To read:

<li> Through table for many-to-many association: https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/#specifying-attributes-from-the-through-table

<li> Validations and constraints: https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/

<li> Fetching associations: lazy loading VS eager loading: https://sequelize.org/docs/v6/core-concepts/assocs/#fetching-associations---eager-loading-vs-lazy-loading

<li> Scopes: https://sequelize.org/docs/v6/other-topics/scopes/
