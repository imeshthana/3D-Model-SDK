require('dotenv').config();

const fs = require('fs');
const path = require('path');
const url = require('url');
const Jimp = require('jimp');

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

console.log('Starting server...');

app.get('/3DModelSDK.js', (req, res) => {
    res.sendFile(path.join(__dirname, '3DModelSDK.js'));
});

app.get('*', async (req, res) => {
    try {
        const query = url.parse(req.url, true).query;
        let file = url.parse(req.url).pathname.slice(1)+'.glb';
        let filePath = path.join(__dirname, 'public', file);

        const processModel = async (inputPath, outputPath) => {
            try {
                const model = await Jimp.read(inputPath);
                await model.writeAsync(outputPath);
                return true;
            } catch (err) {
                console.error('Model processing error');
                console.error(err);
                return false;
            }
        };

        const folder = `${file}`;
        const thumbFolder = path.join(__dirname, 'public', 'thumb', folder);
        const outFile = path.join(thumbFolder, file);

        if (!fs.existsSync(thumbFolder)) {
            fs.mkdirSync(thumbFolder, { recursive: true });
        }

        if (fs.existsSync(outFile)) {
            return res.sendFile(path.resolve(outFile));
        }

        const processed = await processModel(
            path.resolve(filePath), 
            path.resolve(outFile),  
        );

        if (processed) {
            res.sendFile(path.resolve(outFile));
        } else {
            res.sendFile(path.resolve(filePath));
        }
    } catch (err) {
        console.error('Overall processing error:', err);
        res.status(500).send('Internal Server Error');
    }
});


const PORT = process.env.PORT || 8888;

try {
    app.listen(PORT, () => {
        console.log(`✅ CDN Server successfully running on port ${PORT}`);
    });
} catch (serverError) {
    console.error('❌ Failed to start server:', serverError);
    process.exit(1);
}
