echo "Pocetak deploy...."
rsync -avP build/ dm@donosimo.net:/var/www/donosimo.net/
echo "Kraj deploy. :)"