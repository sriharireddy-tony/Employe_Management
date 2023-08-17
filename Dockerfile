# Use an official Node.js image as the base
FROM node:16 as build-stage

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application code to the container
COPY . .

# Build the Angular application
RUN npm run build --prod

# Use a lightweight NGINX image as the final image
FROM nginx:alpine

# Copy the nginx.conf file to the Nginx configuration directory
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built Angular app from the previous stage to the NGINX directory
COPY --from=build-stage /app/dist/employe-management /usr/share/nginx/html

# Expose port 80 for the NGINX server
EXPOSE 80

# Command to start the NGINX server when the container runs
CMD ["nginx", "-g", "daemon off;"]