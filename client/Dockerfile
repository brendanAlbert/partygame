
# stage 1
FROM node:alpine AS wrinkles
WORKDIR /app
COPY . .
RUN npm install && npm run ng-high-memory


# stage 2

FROM nginx:alpine

COPY --from=wrinkles /app/dist/client /usr/share/nginx/html
#COPY /dist/client /usr/share/nginx/html

EXPOSE 80
