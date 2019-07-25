
#
# DEV
#
dev-api:
	cd ./services/api && make dev

dev-pg:
	cd ./services/database && make dev-pg

dev-mongo:
	cd ./services/database && make dev-mongo

#
# PROD
#

prod-api-node:
	cd ./services/api && make prod-node

prod-api-docker:
	cd ./services/api && make prod-docker

#
# Reset
#
reset-project:
	cd ./services/database && make kill
	cd ./services/database && make clean
	cd ./services/api && make clean-all
	
