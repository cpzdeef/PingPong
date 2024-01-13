# PingPong

link naar server: http://157.193.171.21:3000/

Het goede oude Pong spel met leaderboards en gebruikersaccounts waarbij je ook andere gebruikers kan volgen

## API

### GET

- `/api/users/`
  - GET request for retrieving all users
- `api/users/profiles`
  - GET request for retrieving all user profiles
- `/api/users/name/:username`
  - GET request for retrieving a user by name
- `/api/users/:id`
  - GET request for retrieving a user by ID
- `/api/users/:id/profile`
  - GET request for retrieving a user's profile by ID
- `/api/users/:id/games`
  - GET request for retrieving a user's games by ID
- `/api/users/:id/friends`
  - GET request for retrieving a user's friends by ID
- `/api/users/leaderboard/singleplayer`
  - GET request for retrieving the singleplayer leaderboard
- `/api/users/leaderboard/oneversusone`
  - GET request for retrieving the one versus one leaderboard
- `/api/games/singleplayer`
  - GET request all singleplayer games
- `/api/games/singleplayer/:id`
  - GET request a singleplayer games by ID
- `/api/games/oneversusone`
  - GET request all oneversusone games
- `/api/games/oneversusone/:id`
  - GET request a oneversusone games by ID

### POST

- `/api/users/name/:username`
  - POST request for updating a user by name
- `/api/games/singleplayer`
  - POST single player game
- `/api/games/oneversusone`
  - POST one versus one game
- `/api/auth/login`
  - POST login with name
- `/api/auth/register`
  - POST adding a new user
- `/api/games/singleplayergames`
  - POST single player games
- `/api/games/oneversusonegames`
  - POST one versus one games

### PUT

- `api/users/:id/friends`
  - PUT request for adding a friend to a user's friend list by ID
- `api/users/name/:username`
  - PUT request for updating a user's settings and data by Username

### DELETE

- `/api/users/:id/friends`
  - DELETE request for removing a friend from a user's friend list by ID

## UI

Op de index pagina (`/`) kan er ingelogd worden en is er een menu met al de pagina's.

> Het login systeem in heel basic gemaakt en is er eigenlijk gewoon voor niet altijd een naam in te vullen. En is dus ook niet volgens de standaard gemaakt. Omdat alles in de frontend word afgehandeld en opgeslagen.

Op de login pagina (`/auth/login.html`) kan er ingelogd worden met de user name. Een nieuwe user kan geregistreerd worden op de register pagina (`/auth/register.html`).
Er kan ook altijd uitgelogd worden.

Voor sommige pagina's moet er ingelogd zijn voor op de pagina's te geraken. (bv `/users/account.html` en de games)

Op de account pagina `/users/account.html` kan de user zijn account aangepast worden.

Op de users pagina `/users/` krijg je een lijst met al de users op de site. Er kan op de user zijn worden gedrukt om meer informatie over de user naar boven te halen. Als er ingelogd is kan je hier ook users volgen en onvolgen.

Op de leaderboard pagina `/users/leaderboard.html` kan de leaderboard voor singleplayer en onversusone gezien worden. De leaderboard toont het aantal ticks dat de user heeft gewonnen. Dus hoe minder ticks hoe beter.

Op de singleplayer game pagina `/games/singleplayer.html` kan de singplayer game worden gespeelt nadat de user of bot 5 punten haalt is de game over en word de game opgeslagen in de databank.

Op de multiplayer game pagina `/games/oneversusone.html` kan de multiplayer game worden gespeelt. Om dit te testen moeten er twee of meerdere browser tabladen met verschillende users ingelogd op deze pagina open staan. Dan zie je normaal een lijst met andere users waarmee je kan spelen. Voor met de andere user te spelen moet de play knop worden ingedrukt, het spel start dan automatisch bij beide users.
