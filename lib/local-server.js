module.exports = serve;

function serve(path, port) {
  const env = {
    deviceId: 'rokid/no_sn'
  };
  const driver = require(path)(env);

  const express = require('express');
  const app = new express();

  app.use(require('body-parser').json());
  app.post('/list', function(req, res) {
    driver.list(req.body)
      .then(body => res.send({
        status: 0,
        data: body
      }))
      .catch(error => res.send({
        status: error.errorName
      }))
  });

  app.post('/get', function(req, res) {
    driver.get(req.body.device)
      .then(body => res.send({
        status: 0,
        data: body
      }))
      .catch(error => res.send({
        status: error.errorName
      }))

  });

  app.post('/execute', function(req, res) {
    // console.log(req.body);
    driver.execute(req.body.device, req.body.action)
      .then(body => res.send({
        status: 0,
        data: body
      }))
      .catch(error => res.send({
        status: error.errorName
      }))
  });

  port = port || 3000; //default port 3000
  app.listen(port);

  console.log(`${path} is served with http://127.0.0.1:${port}`)
}