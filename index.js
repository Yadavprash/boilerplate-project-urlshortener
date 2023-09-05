require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const shortid = require('shortid')
const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
const urlDatabase={}
// Basic Configuration
const port = process.env.PORT || 3000;


// Middleware to parse JSON and form data in the request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl',(req,res)=>{

  const { url } = req.body;
  if(urlPattern.test(url) === false){
    res.json({ error : 'invalid url'})
  }else{
    const shortCode = shortid.generate()
    urlDatabase[shortCode] = url;
    const shortUrl = `${req.protocol}://${req.get('host')}/api/shorturl/${shortCode}`;
    console.log(shortUrl)
    res.json({original_url: url, short_url:shortCode})
  }
})

app.get('/api/shorturl/:shortcode',(req, res)=>{
  const { shortcode }= req.params;
  console.log(shortcode)
  console.log(urlDatabase)
  const originalUrl = urlDatabase[shortcode];
  console.log(urlDatabase[shortcode])
  if (!originalUrl) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  res.redirect(originalUrl);
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
