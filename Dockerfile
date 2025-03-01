# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the application will run on
EXPOSE 8080

# Define the command to run the application
# This may need to be revisited when we go to set it up on EB. AWS.
CMD ["bash", "-c", "npm", "run", "dev", "--", "--host", "0.0.0.0"]
