import express from "express";

const app = express();
const env = process.env.NODE_ENV || 'LOCAL';
const PORT = process.env.PORT || 8080;
const version = process.env.VERSION || 'LOCAL';

app.get('/version', (req, res) => {
    res.json({'version': version});
})

app.use(express.static('src'))

app.listen(PORT, () => {
    console.log(`App running on ${PORT} in ${env}`);
});