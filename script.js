const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;
const main = fs.readFileSync('spark/bank.html')
const home = fs.readFileSync('./home.html')
const transfer = fs.readFileSync('./transfer.html')
const history = fs.readFileSync('./history.html')
const Members = fs.readFileSync('./members.html')

const server = http.createServer((req, res)=>{
    console.log(req.url);
    url = req.url;
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    if(url == '/'){
        res.end(main);
    }
    else if(url == './home'){
        res.end(home);
    }
    else if(url == 'transfer.html'){
        res.end(transfer);
    }
    else if(url == 'history.html'){
        res.end(history);
    }
    else if(url == 'members.html'){
        res.end(members);
    }
    else{
        res.statusCode = 404;
        res.end("<h1>404 not found</h1>");
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });