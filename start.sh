#/bin/sh
sudo service mysql start;
echo "Entrez votre login mysql : ";
read login;
mysql -u $login -p -e "source createDB.sql";
echo "Base de données créée";
kill -9 $(lsof -t -i tcp:3000,8080)
cd back;
sudo npm install;
sudo npm install -g nodemon;
nodemon server&
cd ../front;
sudo npm install;
npm run serve&
sleep 4;
xdg-open http://localhost:8080