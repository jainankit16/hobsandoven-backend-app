FROM node:9.11-alpine

# Bundle APP files
COPY src src/
COPY pm2.json .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install pm2 -g

#RUN cd src && npm install --production
RUN apk --no-cache --virtual build-dependencies add g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git
RUN cd /src && npm install --production
RUN apk del build-dependencies

# Show current folder structure in logs
RUN ls -al -R

EXPOSE 80 3000 443 43554 22

CMD [ "pm2-runtime", "start", "pm2.json" ]
