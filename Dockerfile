# => Build container
FROM node:alpine as builder
WORKDIR /app
COPY client client
COPY server server
COPY package.json .
RUN npm install

# => Run container
FROM nginx:alpine

# Nginx config
# RUN rm -rf /etc/nginx/conf.d
# COPY nginx/conf /etc/nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Static build
WORKDIR /app
COPY --from=builder /app/client/build /usr/share/nginx/html/build
COPY --from=builder /app/server server
COPY package.json .

# Default port exposure
EXPOSE 80

# Add npm
RUN apk add bash && apk add npm

# Copy .env file and shell script to container
# WORKDIR /usr/share/nginx/html
# COPY .env .

# Start Nginx server
CMD ["/bin/bash", "-c", "nginx && node server/server.js"]