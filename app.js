const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config()

const app = express();
const postsRoutes = require('./routes/posts');
const getsRoutes = require('./routes/gets');
const putsRoutes = require('./routes/puts');
const deletesRoutes = require('./routes/deletes');
require('./database/mongoose');


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/images',express.static(path.join('images/')));
app.use(express.static(__dirname + '/angularapp'));

//app.set('view engine', 'ejs');

// middleware to implement cors(cross origin resource sharing)
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,PUT");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
//package to implement cors
app.use(cors());

/* app.get('/gets', (req,res) => {
    res.send('hello gets');
}) */
app.get('/*', (req, res) =>
    res.sendFile(path.join(__dirname, 'angularapp/index.html'))
);
app.use('/', getsRoutes );
app.use('/', postsRoutes);
app.use('/', putsRoutes);
app.use('/', deletesRoutes);


// app.use((req,res) => {
//  res.status(404).render('404')
// });
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT,() => console.log(`Server Connected and Listening on ${PORT}.`));
