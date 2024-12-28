FROM node:latest

ENTRYPOINT [ "ntnui-membership-bot" ]

WORKDIR /app
VOLUME [ "/app/config" ]

COPY . .

RUN npm install -y
CMD [ "npm start" ]