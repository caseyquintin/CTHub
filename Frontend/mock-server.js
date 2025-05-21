const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Set the port
const port = 3001;

// Add /api prefix to all routes
server.use('/api', router);
server.use(middlewares);

// Custom routes for status filtering
server.get('/api/containers/status/:status', (req, res) => {
  const status = req.params.status;
  const containers = router.db.get('containers').filter({ currentStatus: status }).value();
  res.jsonp(containers);
});

// Start the server
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
  console.log(`API is available at http://localhost:${port}/api`);
});

// Add rewriter to make API work correctly
server.use(jsonServer.rewriter({
  '/api/*': '/$1',
  '/api/containers/status/:status': '/containers/status/:status',
  '/api/dropdownOptions/category/:category': '/dropdownOptions/category/:category',
  '/api/terminals/port/:portId': '/terminals/port/:portId',
  '/api/vessels/vesselLine/:vesselLineId': '/vessels/vesselLine/:vesselLineId'
}));