FROM nginx:latest
COPY ./nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html
COPY ./dist/app /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx

CMD envsubst '$$APP_ENVIRONMENT' < /etc/nginx/nginx.conf > /etc/nginx/nginx.conf && nginx -g 'daemon off;'