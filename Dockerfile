FROM nginx:1.12

WORKDIR /home/app

COPY ./view /home/app

COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
