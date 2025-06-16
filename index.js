const express = require('express');
const multer = require('multer');
const unzipper = require('unzipper');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
const scormData = {}


const PORT = 3000;

const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use('/scorm', express.static('scorm_packages'));

app.get('/', (req, res) => {
    console.log('getting')
    res.send(`
    <h2>Sube tu archivo SCORM (.zip)</h2>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="scormFile" />
      <button type="submit">Subir</button>
    </form>
  `);
});

app.post('/upload', upload.single('scormFile'), async (req, res) => {
    console.log('uploading')
    const zipPath = req.file.path;
    const packageId = Date.now().toString();
    const extractPath = path.join(__dirname, 'scorm_packages', packageId);
    fs.mkdirSync(extractPath);
    fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: extractPath }))
        .on('close', () => {
            fs.unlinkSync(zipPath);

            const apiPath = path.join(extractPath, 'API.js');
            const sourceApiPath = path.join(__dirname, 'scorm_runtime', 'API.js');

            if (!fs.existsSync(apiPath)) {
                fs.copyFileSync(sourceApiPath, apiPath);
            }

            // Inyectar <script src="API.js"> en el HTML principal (scormVid.html)
            const htmlPath = path.join(extractPath, 'scormVid.html');
            if (fs.existsSync(htmlPath)) {
                let html = fs.readFileSync(htmlPath, 'utf-8');
                if (!html.includes('API.js')) {
                    html = html.replace('</head>', '  <script src="API.js"></script>\n</head>');
                    fs.writeFileSync(htmlPath, html, 'utf-8');
                    console.log(' <script src=\"API.js\"> inyectado automáticamente');
                } else {
                    console.log('El HTML ya tenía <script src=\"API.js\">');
                }
            } else {
                console.warn(' HTML principal no encontrado para inyección');
            }

            res.redirect(`/scorm/${packageId}/scormVid.html`);
        })

});

app.post('/scorm-data', (req, res) => {
    const { key, value, sessionId = 'demo' } = req.body;

    if (!scormData[sessionId]) {
        scormData[sessionId] = {};
    }

    scormData[sessionId][key] = value;

    console.log(` Terminado? [${sessionId}] ${key} = ${value}`);

    res.sendStatus(200);
});




app.listen(PORT, () => {
    console.log(`Servidor listening on port: ${PORT}`);
});
