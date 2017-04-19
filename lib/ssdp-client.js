// @flow

const Client = require('./ssdp/client');
const debug = require('debug')('ssdp-client');
const SSDPDevice = require('./ssdp-device');
const colors = require('colors');

/**
 * ssdp client
 * @param options
 * @param options.onDeviceResponse;
 * @param options.onDeviceAlive;
 * @param options.onDeviceOffline;
 * @param command
 */
module.exports = function(options, command) {
  const client = new Client();

  client.on('response', function (headers) {
    if (command.verbose) {
      console.log('rhome ssdp receive response:'.blue);
      console.log(headers);
      console.log(colors.green(new Date()));
      console.log();
    }

    if (headers.ST !== 'homebase:device') return;
    let device = SSDPDevice.getDeviceFromHeader(headers);
    if (device) {
      options.onDeviceResponse(device);
    }
  });

  client.on('advertise-alive', function (headers) {

    if (command.verbose) {
      console.log('rhome ssdp receive advertise-alive:'.blue);
      console.log(headers);
      console.log(colors.green(new Date()));
      console.log();
    }

    if (headers.NT !== 'homebase:device') return;
    let device = SSDPDevice.getDeviceFromHeader(headers);
    if (device) {
      options.onDeviceAlive(device);
    }
  });

  client.on('advertise-bye', function (headers) {

    if (command.verbose) {
      console.log('rhome ssdp receive advertise-bye:'.blue);
      console.log(headers);
      console.log(colors.green(new Date()));
      console.log();
    }
    if (headers.NT !== 'homebase:device') return;
    let device = SSDPDevice.getDeviceFromHeader(headers);
    if (device) {
      options.onDeviceOffline(device);
    }
  });

  return {
    search() {
      client.search('homebase:device');
    },
    client,
    stop: () => client.stop()
  }
};


