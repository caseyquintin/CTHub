const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Custom routes for API endpoints that our frontend expects
server.get('/api/containers', (req, res) => {
  const containers = router.db.get('containers').value();
  res.jsonp(containers);
});

server.get('/api/containers/status/:status', (req, res) => {
  const status = req.params.status;
  const containers = router.db.get('containers').filter({ currentStatus: status }).value();
  res.jsonp(containers);
});

server.get('/api/dropdownOptions', (req, res) => {
  const options = router.db.get('dropdownOptions').value();
  res.jsonp(options);
});

server.get('/api/ports', (req, res) => {
  const ports = router.db.get('ports').value();
  res.jsonp(ports);
});

server.get('/api/terminals', (req, res) => {
  const terminals = router.db.get('terminals').value();
  res.jsonp(terminals);
});

server.get('/api/shiplines', (req, res) => {
  const shiplines = router.db.get('shiplines').value();
  res.jsonp(shiplines);
});

server.get('/api/vesselLines', (req, res) => {
  const vesselLines = router.db.get('vesselLines').value();
  res.jsonp(vesselLines);
});

server.get('/api/vessels', (req, res) => {
  const vessels = router.db.get('vessels').value();
  res.jsonp(vessels);
});

// Handle other methods (POST, PUT, DELETE) for containers
server.post('/api/containers', (req, res) => {
  const newContainer = req.body;
  const containers = router.db.get('containers');
  const maxId = containers.map('containerID').max() || 0;
  newContainer.containerID = maxId + 1;
  containers.push(newContainer).write();
  res.jsonp(newContainer);
});

server.put('/api/containers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedContainer = req.body;
  router.db.get('containers')
    .find({ containerID: id })
    .assign(updatedContainer)
    .write();
  res.jsonp(updatedContainer);
});

server.delete('/api/containers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  router.db.get('containers')
    .remove({ containerID: id })
    .write();
  res.jsonp({});
});

// Use default router for other endpoints
server.use('/api', router);

const port = 3001;
server.listen(port, () => {
  console.log(`Mock API Server is running on port ${port}`);
  console.log(`API endpoints available at http://localhost:${port}/api`);
});