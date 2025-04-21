 #Fetching the latest Node.js image on Alpine Linux
 FROM node:alpine AS development
#
# # Declaring environment variables
 ENV NODE_ENV=development
 ENV PORT=3020
#
# # Setting up the working directory
 WORKDIR /app
#
# # Copying package files
 COPY package*.json ./
#
# # Installing dependencies with legacy peer dependencies handling
 RUN npm install --legacy-peer-deps
#
# # Copying all the project files to the container
 COPY . .
#
# # Change to the backend directory
 WORKDIR /app/backend/src/
#
# # Exposing the port (match with the PORT env variable)
  EXPOSE 3020
#
# # Start the app using npm and node
CMD ["node", "index.js"]
#
