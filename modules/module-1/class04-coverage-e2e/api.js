import http from 'http';

function getRequestData(request, callback) {
  let data = '';

  request.on('data', (chunk) => {
    data += chunk;
  });

  request.on('end', () => callback(JSON.parse(data)));
}

const routes = {
  '/contact:get': (request, response) => {
    response.write('contact us page');
    return response.end();
  },
  '/login:post': (request, response) => {
    getRequestData(request, (data) => {
      const { username, password } = data;
      if (username === 'Kaio Woen' && password === '123') {
        response.write('login has succeeded');
        response.end();
      } else {
        response.writeHead(401);
        response.write('invalid credentials');
        response.end();
      }
    });
  },
  default: (request, response) => {
    response.write('hello');
    return response.end();
  },
};

const handler = (request, response) => {
  const { url, method } = request;
  const routeKey = `${url}:${method}`.toLowerCase();
  const choosen = routes[routeKey] || routes.default;
  response.writeHead(200, {
    'Content-Type': 'text/html',
  });
  return choosen(request, response);
};

const app = http.createServer(handler).listen(3000, () => {
  console.log('app running at', 3000);
});

export default app;
