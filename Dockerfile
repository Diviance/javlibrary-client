# Use an official Node.js runtime as a parent image
FROM node:20.11.1-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml (or yarn.lock/package-lock.json) to the container
COPY package.json pnpm-lock.yaml* ./

# Install pnpm and project dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy the rest of your app's source code to the container
COPY . .

# Make port 5173 available to the world outside this container
EXPOSE 5173

# Command to run the app
CMD ["pnpm", "start"]
