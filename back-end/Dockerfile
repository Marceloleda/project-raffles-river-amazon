FROM node

USER root

WORKDIR /usr/src

COPY . .

RUN npm i 
RUN npm run build

USER node

EXPOSE 5000

CMD ["npm", "start"]    