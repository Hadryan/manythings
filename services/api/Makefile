
dev:
	yarn install
	yarn start:dev

prod:
	humble stop buildApp
	humble rm -f buildApp
	humble up -d buildApp

clean-npm:
	yarn clean:npm

clean-build:
	yarn clean

clean-all:
	make clean-npm
	make clean-build
