#/bin/sh
if [ ! -f "back/.env" ];then
echo "Il faut ajouter le fichier .env dans le répertoire 'back'";
exit 0;
fi
if [ ! -f "back/images/1.webp" ];then
echo "Il faut ajouter les images dans le répertoire 'back/images/'";
exit 0;
fi
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