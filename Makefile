# TASKS

# Build project
build: build/dependencies/install build/dependencies/safety-check

# Install dependent libraries
build/dependencies/install:
	echo $GITHUB_REF
	yarn install --frozen-lockfile --silent

# Run safety check on libraries dependencies
build/dependencies/safety-check:
	yarn audit

# Run project tests
test: test/run

test/lint:
	echo lint

# Run tests with its coverage report
test/run:
	yarn test

# # Upload coverage report
# #
# #   make test/coverage/upload
# #
# test/coverage/upload:
# ifdef TRAVIS_BRANCH
# 	$(PYTHON_BIN)/codecov -t $(CODECOV_TOKEN) -b $(CURRENT_BRANCH)
# endif

# Setup dependent services and third party dependencies
#
#   make dependencies/services
#
# dependencies/services: dependencies/services/start
# dependencies/services/start:
# 	docker-compose up -d
# 	sleep 5
# dependencies/clean/services:
# 	docker-compose stop && docker-compose rm -vf

# # Generate a new migration file that holds a database change
# #
# #   make db/migration name=add_poc_table
# #
# db/migration:
# 	$(PYTHON_BIN)/alembic revision -m $(name)

# # Run the pending migrations against the configured database (default to docker/local database)
# #
# #   make db/migrate
# #
# db/migrate:
# 	$(PYTHON_BIN)/alembic -x DB_URL=$(MIGRATE_DB_URL) upgrade head

# # Setup the local development environment with python3 .env and project dependencies
# #
# #   make setup/environment
# #
# setup/environment:
# 	virtualenv .env -p python3
# 	make pip

# # Build package, migrate database and deploy application to the given `stage`
# #
# #   make deploy stage=dev
# #
# deploy: build deploy/migrate-db
# 	serverless deploy --stage ${STAGE}

# deploy/migrate-db: deploy/environment-tunnel deploy/db/migrate

# deploy/db/migrate:
# 	$(PYTHON_BIN)/alembic -x DB_URL=$(MIGRATE_DB_URL) upgrade head

# deploy/environment-tunnel: deploy/decrypt-ssl-key
# 	ssh -4 -L $(MIGRATE_DB_PORT):${DB_HOST}:${DB_PORT} ec2-user@${MIGRATE_DB_TUNNEL_ID} -fN -o StrictHostKeyChecking=no -i deploy/${PEM_FILE}.pem


# deploy/decrypt-ssl-key: deploy/clean/decrypt-ssl-key
# 	openssl aes-256-cbc -k "${PEM_PASS}" -in deploy/${PEM_FILE}.pem.enc -out deploy/${PEM_FILE}.pem -d
# 	chmod 400 deploy/${PEM_FILE}.pem

# deploy/clean/decrypt-ssl-key:
# 	rm -f deploy/${PEM_FILE}.pem