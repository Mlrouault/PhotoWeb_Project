# PhotoWeb_Project

1) Install HomeBrew, for mac type in console

    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

2) Use HomeBrew to install node.js and NPM, type in console

    brew install node

3) Install mongodb type in console

    brew install mongodb

4) To get the project started type in console

    git clone https://github.com/Mlrouault/PhotoWeb_Project.git

5) Switch to the new project directory, PhotoWeb_Project/node_auth

6) Install the node.js packages, type in console

    npm install

7) Run mongodb and specify the data directory for the database, type in console

    mongod --dbpath ~/node_auth/data/db

8) Start local server, type in console

    node server.js

9) test at http://localhost:8080/

10) If you experience an error while starting the server try:

    npm update

    npm cache clean

    rm -rf node_modules

    npm i
    
