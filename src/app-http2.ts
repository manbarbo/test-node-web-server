import http2 from 'http2';
import * as fs from 'node:fs';

const server = http2.createSecureServer({
  key: fs.readFileSync('./keys/server.key'),
  cert: fs.readFileSync('./keys/server.crt'),
}, (req, res) => {
  console.log(req.url);
  // res.writeHead(200, { 'Content-Type': 'text/html' });
  // res.write(`<h1>Hello World ${ req.url }</h1>`);
  // res.end();

  // const data = { name: 'John Doe', age: 30, city: 'New York' };
  // res.writeHead(200, { 'Content-Type': 'application/json' });
  // res.write(JSON.stringify(data));
  // res.end();

  if (req.url === '/') {
    const htmlFile = fs.readFileSync('./public/index.html', 'utf-8');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(htmlFile);
    res.end();
    return;
  }

  if (req.url?.endsWith('.js')) {
    res.writeHead(200, {'Content-Type': 'text/javascript'});
  }
  else if (req.url?.endsWith('.css')) {
    res.writeHead(200, {'Content-Type': 'text/css'});
  }
  try {
    const responseContent= fs.readFileSync(`./public${req.url}`, 'utf-8');
    res.end(responseContent);
  } catch (error) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('404 Not Found');
  }
});

server.listen(8080, ()=> {
  console.log('Server is running on port 8080');
});