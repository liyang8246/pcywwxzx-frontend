const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js';
const outputPath = path.resolve(__dirname, '..', 'src', 'alpine.js');

https.get(url, (response) => {
    const writeStream = fs.createWriteStream(outputPath);

    response.pipe(writeStream);

    writeStream.on('finish', () => {
    writeStream.close();
    console.log('Download completed.');
    });
}).on('error', (error) => {
    console.error(`Error downloading file: ${error.message}`);
});
