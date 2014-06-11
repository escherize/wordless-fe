cd ~/wordless-fe;
git stash;
git pull;
sudo cp -urv ~/wordless-fe/* /var/www/html;
sudo service apache2 restart;
