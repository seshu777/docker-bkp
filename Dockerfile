FROM node:latest
RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install
RUN npm install -g @angular/cli
COPY . /app
CMD ["npm", "start"]

