
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

kill:
	humble stop mongo
	humble rm -f mongo
	humble stop mongo-express
	humble rm -f mongo-express
	humble stop postgres
	humble rm -f postgres

clean:
	make kill
	rm -rf data