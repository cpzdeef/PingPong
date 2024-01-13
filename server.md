# Postgres

Switch over to the postgres account on server
`sudo -i -u postgres`

Go back to student prompt
`exit`

Access the postgres prompt
`psql`

Exit postgres prompt
`\q`

Change password of postgres (in the postgres prompt)
`\password postgres`
Then enter new password

Then go back to student prompt and restart the service
`sudo service postgresql restart`

The password of the postgres account is the password for student of this server

# Project

`git clone ...`
Add .env file

Server updaten met nieuwe versie

`git pull`

`npm i`

`npm start`

# Deploy

`npm run build`

copyfiles heeft op linux een rare bug dat die niet alle html files copieert
voor dit te fixen
`cd src/public`
`cp -r auth games users img ../../build/public`

`node build/app.js`

of voor in de achtergrond te draaien

`pm2 start build/app.js`

stop

`pm2 stop build/app.js`
