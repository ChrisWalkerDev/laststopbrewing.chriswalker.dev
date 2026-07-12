FROM node:slim AS build

# Create app directory
WORKDIR /dist/src/app

# Remove cache
RUN npm cache clean --force

# Add the source code to app
COPY . .

# Install all the dependencies
RUN npm install

# Generate the build of the application
RUN npm run build --prod

# Defining nginx image to be used
FROM nginx:latest as ngi

# Copying compiled code and nginx config to different folder
COPY --from=build /dist/src/app/dist/laststopbrewing.chriswalker.dev/browser /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/templates/nginx.conf.template

EXPOSE 8080