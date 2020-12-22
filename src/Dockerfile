FROM nginx:latest
COPY ./src/nginx.conf /etc/nginx/nginx.conf.template

RUN rm -rf /usr/share/nginx/html
COPY ./dist/app /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx

CMD envsubst '$$APP_ENVIRONMENT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && \
env | grep -e "^APP_" > /usr/share/nginx/html/assets/launch-environment.ini && \
nginx -g 'daemon off;'