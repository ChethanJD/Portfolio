FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY . /srv
RUN rm -f /srv/Caddyfile /srv/Dockerfile
EXPOSE 8080
