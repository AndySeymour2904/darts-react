FROM node:14

WORKDIR /app

RUN npm install express body-parser pg cors uuid

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
