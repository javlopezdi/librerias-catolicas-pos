# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the rest of the application code
COPY . .

# Build the Angular app with production configuration and debug
RUN ng build --configuration production
RUN echo "Build output:" && ls -la /app/dist/frontend/browser

# Stage 2: Serve
FROM nginx:alpine

# Copy the build output to Nginx, using the browser subfolder
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
# Copy custom Nginx config for Angular routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]