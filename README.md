# Northcoders News API

In order to connect to your databases, please add two .env files. First, a .env.development for creating your main database, and then .env.test for creating your test database.

In each of these files, include the following code:

```
PGDATABASE=your_database_name_here
```

You will be able to see and/or rename these files in the setup.sql file.

Before creating your database, first ensure you have npm initialised on your local device. You can do this by running:

```
npm init -y
```

Then, install dotenv, node-postgres, and pg-format to ensure your seeds functions correctly. You can install these with:

```
npm i dotenv
```

```
npm i pg
```

```
npm i pg-format
```

After this, you can create your databases and run the seed files.

To create your database, type

```
npm run setup-dbs
```

into the terminal. Then, to create your development databse, type

```
npm run seed
```

into the terminal.
