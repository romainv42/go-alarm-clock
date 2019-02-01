default: buildServer buildClient package

package: 
	mv alarm-server ./pkg-debian/usr/bin/alarm/
	mv assets.zip ./pkg-debian/var/www/
	dpkg -b pkg-debian/ alarm-clock.deb

buildServer:
	GOOS=linux GOARCH=arm go build -o alarm-server

buildClient:
	cd assets && npm run build
	mkdir -p assets/bin
	mv ./assets/dist/main.js ./assets/bin/app.js
	zip -9 -r --exclude=*src* \
		--exclude=*package.json* \
		--exclude=*package-lock.json* \
		--exclude=*dist* \
		--exclude=*node_modules* \
		--exclude=*.DS_Store* \
                --exclude=*portal* \
		assets.zip ./assets

