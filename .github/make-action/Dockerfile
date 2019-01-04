FROM node:10-slim

LABEL version="1.0.0"
LABEL repository="http://github.com/flpStrri/Lilium"
LABEL homepage="http://github.com/flpStrri/Lilium"
LABEL maintainer="João Storarri <joao+lilium@filipestorarri.com>"

LABEL com.github.actions.name="Lilium action enviriorment"
LABEL com.github.actions.description="Wraps the CI/CD dependencies for Lilium repository."
LABEL com.github.actions.icon="package"
LABEL com.github.actions.color="gray-dark"

COPY "entrypoint.sh" "/entrypoint.sh"
ENTRYPOINT ["/entrypoint.sh"]