echo "Pocetak deploy...."
rsync -avP build/ dm@donosimo.net:/var/www/donosimo015_test/prodavnica
echo "Kraj deploy. :)"