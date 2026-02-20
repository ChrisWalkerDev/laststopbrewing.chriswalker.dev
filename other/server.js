import express from "express";

const app = express();
const env = process.env.NODE_ENV || 'LOCAL';
const PORT = process.env.PORT || 8080;
const version = process.env.VERSION || 'LOCAL';

app.get('/version', (req, res) => {
    res.json({'version': version});
})

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

const staticDir = path.join(process.cwd(), 'src');
app.use(express.static(staticDir));

app.listen(PORT, () => {
    console.log(`App running on ${PORT} in ${env} (version: ${version})`);
});

// graceful shutdown
process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));

export default app;