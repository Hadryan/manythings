
init:
	cp -a ../node-init/ ./

setup:
	cp ../node-setup/.env ./.env
	cp ../node-setup/package.json ./package.json
	cp ../node-setup/index.js ./index.js
	cp ../node-setup/.gitignore ./.gitignore
	cp ../node-setup/Dockerfile ./Dockerfile

	cp ../node-setup/src/boot.js ./src/boot.js
	cp -a ../node-setup/src/features/ ./src/features/
	cp -a ../node-setup/src/services/ ./src/services/

dev:
	yarn install
	yarn start:dev

prod:
	yarn install
	yarn start:prod

reset:
	yarn reset