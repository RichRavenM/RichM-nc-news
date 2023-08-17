
██████  ██  ██████ ██   ██ ███████                                                           
██   ██ ██ ██      ██   ██ ██                                                                
██████  ██ ██      ███████ ███████                                                           
██   ██ ██ ██      ██   ██      ██                                                           
██   ██ ██  ██████ ██   ██ ███████                                                           
                                                                                             
                                                                                             
███    ██  ██████  ██████  ████████ ██   ██  ██████  ██████  ██████  ███████ ██████  ███████ 
████   ██ ██    ██ ██   ██    ██    ██   ██ ██      ██    ██ ██   ██ ██      ██   ██ ██      
██ ██  ██ ██    ██ ██████     ██    ███████ ██      ██    ██ ██   ██ █████   ██████  ███████ 
██  ██ ██ ██    ██ ██   ██    ██    ██   ██ ██      ██    ██ ██   ██ ██      ██   ██      ██ 
██   ████  ██████  ██   ██    ██    ██   ██  ██████  ██████  ██████  ███████ ██   ██ ███████ 
                                                                                             
                                                                                             
███    ██ ███████ ██     ██ ███████                                                          
████   ██ ██      ██     ██ ██                                                               
██ ██  ██ █████   ██  █  ██ ███████                                                          
██  ██ ██ ██      ██ ███ ██      ██                                                          
██   ████ ███████  ███ ███  ███████                                                          
                                                                                             
                                                                                             
 █████  ██████  ██                                                                           
██   ██ ██   ██ ██                                                                           
███████ ██████  ██                                                                           
██   ██ ██      ██                                                                           
██   ██ ██      ██                                                                           
                                                                                             
                                                                                             



#

Welcome to Rich's Northcoders News API! The best API for all your Northcoders News Needs! Here you can access my API server to get all the information you'll ever need about the latest Northcoders News articles, who's reacted to them, and most importantly, who those people were!

Here's the website the server's hosted on for your pleasure

`https://nc-news-api-rich.onrender.com/`

## Getting Started

Before commencing, please ensure you're running a version of Node.js that's **at least v18.11.3**

To have access to the code. You'll need to clone this git repository into your local device. To do this, please enter

`git clone https://github.com/RichRavenM/RichM-nc-news`

into your terminal.

<br>

In order to connect to your databases, please add two .env files. First, a .env.development for creating your main database, and then a .env.test for creating your test database.

In each of these files, include the following code:

```
PGDATABASE=your_database_name_here
```

You'll be able to see and/or rename these files in the setup.sql file.

Before creating your database, first ensure you have npm initialised on your local device. You can do this by running:

```
npm init -y
```

Then, install dotenv, node-postgres, and pg-format as dependencies to ensure your seeds functions correctly. You can install these with:

```
npm i dotenv
```

```
npm i pg
```

```
npm i pg-format
```

Please ensure that you install node-postgres **v8.7.3 or higher**.

<br>

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

<br>

Finally, before you can interact with the API on your own device, install express as a final dependency.
To do this, type  
```
npm i express
```

into your terminal.

## Interacting with the Database

You'll be able to interact with the database using several HTTP methods (via express). These are GET, POST, PATCH, and DELETE. You can use these methods on various endpoints to interact with the database you'll have seeded by now.

To see what endpoints are available, the methods you can use on them, and further information about each of these, perform a GET request to

```
/api
```

Alternatively, visit

```
https://nc-news-api-rich.onrender.com/api
```

## Testing

If you'd like to further work on this codebase, you're likely going to want to test things out too. For this, please ensure you have the necessary devDependencies installed for testing.

These are jest, jest-extended, jest-sorted, and supertest.

To install jest, type

```
npm i -D jest
```

into your terminal.<br>

To install jest-extended, type

```
npm i -D jest-extended
```

into your terminal.<br>

To install jest-sorted, type

```
npm i -D jest-sorted
```

into your terminal.<br>

To install supertest, type

```
npm i -D supertest
```

into your terminal.

<br>
After this, ensure your package.json file's updated to all jest to run. First ensure you have jest set to your npm test.

```
"scripts": {
    "test": "jest"
  }
```

Next, update your package.json to include the following:

```
"jest": {
    "setupFilesAfterEnv": [
      "jest-extended/all",
      "jest-sorted"
    ]
  }
```

Each time you run a test, a new test database will be seeded, ensuring you don't ever inadvertently interact with your development database in a way you wouldn't want to.

<br>

Finally, before committing, husky will run all the tests again to ensure everything's up to scratch. If any fail, you won't be able to commit your files.

husky _should_ be pre-installed and setup when you clone this repo. However, if it isn't, follow these instructions (documentation sourced from https://www.npmjs.com/package/husky):

First, install husky

```
npm i -D husky
```

Then, update your script section in your package.json

```
"scripts": {
    "prepare": "husky install"
  }
```

Add a hook:

```
npx husky add .husky/pre-commit "npm test"
git add .husky/pre-commit
```

Make a commit:

```
git commit -m "Keep calm and commit"
# `npm test` will run
```

```

.------..------..------..------..------..------.
|R.--. ||I.--. ||C.--. ||H.--. ||'.--. ||S.--. |
| :(): || (\/) || :/\: || :/\: || :/\: || :/\: |
| ()() || :\/: || :\/: || (__) || :\/: || :\/: |
| '--'R|| '--'I|| '--'C|| '--'H|| '--''|| '--'S|
`------'`------'`------'`------'`------'`------'
.------..------..------..------..------..------..------..------..------..------..------..------.
|N.--. ||O.--. ||R.--. ||T.--. ||H.--. ||C.--. ||O.--. ||D.--. ||E.--. ||R.--. ||'.--. ||S.--. |
| :(): || :/\: || :(): || :/\: || :/\: || :/\: || :/\: || :/\: || (\/) || :(): || :/\: || :/\: |
| ()() || :\/: || ()() || (__) || (__) || :\/: || :\/: || (__) || :\/: || ()() || :\/: || :\/: |
| '--'N|| '--'O|| '--'R|| '--'T|| '--'H|| '--'C|| '--'O|| '--'D|| '--'E|| '--'R|| '--''|| '--'S|
`------'`------'`------'`------'`------'`------'`------'`------'`------'`------'`------'`------'
.------..------..------..------.
|N.--. ||E.--. ||W.--. ||S.--. |
| :(): || (\/) || :/\: || :/\: |
| ()() || :\/: || :\/: || :\/: |
| '--'N|| '--'E|| '--'W|| '--'S|
`------'`------'`------'`------'
.------..------..------.
|A.--. ||P.--. ||I.--. |
| (\/) || :/\: || (\/) |
| :\/: || (__) || :\/: |
| '--'A|| '--'P|| '--'I|
`------'`------'`------'

```
