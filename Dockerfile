FROM hava/docker-build:1.0.3
MAINTAINER Team Hava <team@hava.io>

WORKDIR /hava-viewer

COPY .yarnrc package.json yarn.lock /hava-viewer/
RUN yarn install

ENV PATH /hava-viewer/node_modules/.bin/:$PATH

COPY . /hava-viewer
