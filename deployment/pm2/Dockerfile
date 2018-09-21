FROM keymetrics/pm2:latest-alpine

# Bundle APP files
COPY src src/
COPY pm2.json .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
# RUN cd src && npm install --production
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && cd src && npm install --production \
    && apk del build-dependencies

# Show current folder structure in logs
RUN ls -al -R

EXPOSE 8080 80 3000 443 43554

CMD [ "pm2-runtime", "start", "pm2.json" ]
