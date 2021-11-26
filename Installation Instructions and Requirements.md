# Installation Requirements

MongoDB: https://www.mongodb.com/try/download/community
(We used community version 5.0.4)

![Image not found](https://github.com/AdamMetz/Trivia-Game-Site/blob/main/installation-document-images/mongodb.png?raw=true)

Node.js: https://nodejs.org/en/download/
(We used LTS v16.13.0)


# Installation Instructions

## Downloading the files
Either clone the repository using the command:


git clone https://github.com/AdamMetz/Trivia-Game-Site/src

Or directly install the src/ folder within the repository.







## Creating the .env file
Create a file directly within **src/** named **.env** and within the file, simply add the text SECRET = “ ”, with any words and/or letters you would like within the quotations, but it must be filled with some letters and/or words.

You should now have **src/.env** with e.g. SECRET = “VERY SECRET TEXT” in the file.

![Image not found](https://github.com/AdamMetz/Trivia-Game-Site/blob/main/installation-document-images/env.png?raw=true)

## Installing NPM Dependencies

Now open up a terminal directed at the **src/** folder. Enter the command:

npm install

This will download all the dependencies necessary to run the project, this may take a minute or two.

![Image not found](https://github.com/AdamMetz/Trivia-Game-Site/blob/main/installation-document-images/npm.png?raw=true)

## Running mongod

Open up a terminal where mongo is a recognized command.

Enter the command:

mongod

Leave this terminal window open while the site is in use.

![Image not found](https://github.com/AdamMetz/Trivia-Game-Site/blob/main/installation-document-images/mongod.png?raw=true)


## Running the server for the website

Now open up a terminal directed at the **src/** folder. Enter the command:

nodemon

This will host the website locally on your machine

![Image not found](https://github.com/AdamMetz/Trivia-Game-Site/blob/main/installation-document-images/nodemon.png?raw=true)

## Viewing the website

Open any web browser, preferably Firefox, Edge, or Chrome, and enter into the address bar:

localhost:3000

![Image not found](https://github.com/AdamMetz/Trivia-Game-Site/blob/main/installation-document-images/browser.png?raw=true)

After these six steps have been completed, the website should be up and running locally on your machine, and the site can be used!

**NOTE: The site is optimally viewed in a 1920x1080 resolution. Smaller or larger resolutions will heavily reduce the functionality of the site!**
