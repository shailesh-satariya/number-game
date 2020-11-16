# The Number Game

The Goal is to implement a game with two independent units – the players – communicating with each other using an API.

# Description
When a player starts, it generates a random (whole) number between 100 and 1000 and sends it to the second player as an approach of starting the game. The receiving player can now always choose between adding one of {-1,0,1} to get to a number that is divisible by 3. The resulting whole number after the received number has been divided by 3 is then sent back to the original sender.
The same rules will be applied until one player reaches the number 1 (after the division).

The random numbers and input values can be changed in config file.

### NPM Install
This project is very easy to install and run.
Clone this repo and open a terminal window and run the following commands to set up the game:

```sh
##To install all the project dependencies
npm install
##To start up the dev server and run the project
npm start
```

That's it! The players can start playing on:
```sh
http://localhost:3000
```

Use different tabs / browser for opponent

### NPM Test

```sh
##To test the project
npm test
```

License
----

MIT
