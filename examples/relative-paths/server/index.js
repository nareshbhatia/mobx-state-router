const express = require('express');
const path = require('path');
const PORT = 3000;

const app = new express();

// Match static files in deploy directory
app.use(express.static('deploy'));

// If no match is found in static files, try this rule.
// Match any path at /myapp with index.html
app.use('/myapp/*', function (req, resp) {
    const indexFile = path.resolve('./deploy/myapp/index.html');
    resp.sendFile(indexFile);
});

app.listen(PORT);
console.log('Listening at port', 3000);
