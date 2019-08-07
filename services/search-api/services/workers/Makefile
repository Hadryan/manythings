
dev:
	yarn install
	yarn start:dev

prod-node:
	yarn install
	yarn start:prod

prod-docker:
	humble build
	humble up -d
	humble logs -f

prod-docker-no-cache:
	humble build --no-cache
	humble up -d
	humble logs -f

clean-npm:
	yarn clean:npm

clean-build:
	yarn clean

clean-all:
	make clean-npm
	make clean-build
