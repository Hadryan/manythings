
#
# DEV
#
dev-webapp:
	cd ./services/webapp && yarn install && yarn start:dev

dev-workers:
	cd ./services/workers && yarn install && yarn start:dev

dev-pg:
	humble stop postgres
	humble rm -f postgres
	humble up -d postgres
	humble logs -f postgres

dev-mongo:
	humble stop mongo
	humble rm -f mongo
	humble stop mongo-express
	humble rm -f mongo-express
	humble up -d mongo
	humble up -d mongo-express
	humble logs -f mongo
	humble logs -f mongo-express

dev-elastic:
	humble stop elasticsearch
	humble rm -rf elasticsearch
	humble stop kibana
	humble rm -rf kibana
	humble up -d elasticsearch
	humble up -d kibana
	humble logs -f elasticsearch
	humble logs -f kibana

dev-grafana:
	humble stop grafana
	humble rm -f grafana
	humble up -d grafana
	humble logs -f grafana

dev-redis:
	humble stop redis
	humble rm -f redis
	humble up -d redis
	humble logs -f redis

#
# PROD
#

#
# Reset
#
reset-all:
	humble do cleanup containers
	rm -rf data
	rm -rf node_modules
	cd ./services/webapp && make clean-all
	cd ./services/workers && make clean-all
	
