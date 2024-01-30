FROM node:16.16.0

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install --save-dev @babel/core @babel/cli @babel/preset-react babel-loader

COPY . .

RUN npm run build

EXPOSE 5001 3000

CMD ["npm", "start"]



