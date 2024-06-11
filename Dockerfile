# Use an official Node runtime as a parent image
FROM node:16-alpine

# Set the working directory to /app inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install --production

# Copy the rest of your application's code
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variables
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379
ENV NODE_ENV=production

# Run the app when the container launches
CMD ["node", "server.js"]
