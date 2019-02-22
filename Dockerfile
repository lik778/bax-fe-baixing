
FROM node:lts as build-stage

WORKDIR /home/app

COPY package*.json ./

RUN npm set registry https://registry.npm.taobao.org
RUN npm set disturl https://npm.taobao.org/dist
RUN npm ci

COPY ./ ./

RUN npm run release


FROM nginx:1.10

COPY --from=build-stage /home/app/view /home/app/

COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
