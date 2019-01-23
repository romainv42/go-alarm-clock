default:
	go build -o alarm-server
	go build -o alarm-now ./launcher
	cd assets && npm run build
	mkdir -p assets/bin
	mv ./assets/dist/main.js ./assets/bin/app.js
	zip -9 -r --exclude=*src* \
		--exclude=*package.json* \
		--exclude=*package-lock.json* \
		--exclude=*dist* \
		--exclude=*node_modules* \
		--exclude=*.DS_Store* \
		assets.zip ./assets

	