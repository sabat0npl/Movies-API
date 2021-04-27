const express = require('express'),
    morgan = require('morgan');

let topMovies = [{
        title: 'Harry Potter and the Sorcerer\'s Stone'
    },
    {
        title: 'Harry Potter and the Chamber of Secrets'
    },
    {
        title: 'Harry Potter and the Prisoner of Azkaban'
    },
    {
        title: 'Harry Potter and the Goblet of Fire'
    },
    {
        title: 'Harry Potter and the Phoenix Order'
    },
    {
        title: 'Harry Potter and the Halfblood Prince'
    },
    {
        title: 'Harry Potter and the Deadly Hallows pt.1'
    },
    {
        title: 'Harry Potter and the Deadly Hallows pt.2'
    },
    {
        title: 'Lord of the Rings: Fellowship of the Ring'
    },
    {
        title: 'Lord of the Rings: Two Towers'
    },
    {
        title: 'Lord of the Rings: Return of the King'
    },
];

const app = express();

app.use(express.static('public'));

app.use(morgan('common'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).send('Ups wrong address');
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('Welcome to my app!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});