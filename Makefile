# TASKS

# Build project
setup: setup/dependencies/install setup/dependencies/safety-check

# Install dependent libraries
setup/dependencies/install:
	echo ${HOME}
	echo ${GITHUB_WORKFLOW}
	echo ${GITHUB_ACTION}
	echo ${GITHUB_ACTOR}
	echo ${GITHUB_REPOSITORY}
	echo ${GITHUB_EVENT_NAME}
	echo ${GITHUB_EVENT_PATH}
	echo ${GITHUB_WORKSPACE}
	echo ${GITHUB_SHA}
	echo ${GITHUB_REF}
	echo ${GITHUB_TOKE}
	yarn install --frozen-lockfile --silent

# Run safety check on libraries dependencies
setup/dependencies/safety-check:
	yarn audit

# Run project tests
test: test/lint dependencies/start test/run dependencies/stop

test/lint:
	yarn lint

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
dependencies/start: dependencies/services/start
dependencies/stop: dependencies/services/stop

dependencies/services/start:
	docker-compose up -d
	sleep 5

dependencies/services/stop:
	docker-compose stop && docker-compose rm -vf


clean:
	ls -a
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