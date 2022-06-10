FROM node:14-alpine

# Create app directory

RUN npm install -g install-subset

#Copy package.json and package-lock to enjoy caching
COPY package.json .
COPY package-lock.json .

RUN subset install build

COPY . .
#COPY tsconfig.json .

EXPOSE 5000

ENTRYPOINT ["npm", "run", "start"]
