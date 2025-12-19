import express from 'express';
import path from 'path';
import cors from 'cors';
import session from 'express-session';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import * as fs from 'node:fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 
    }
}));

// Middleware
app.use(cors({
    origin: true, // Reflects the request origin
    credentials: true // Allows cookies
}));
app.use(express.json());

// 1. First - Protect /protected route
app.use('/protected', (req, res, next) => {
    if (!req.session.isAuthenticated) {
        return res.status(403).send(`
            <h1>Access Denied</h1>
            <p>Authentication required</p>
        `);
    }
    next();
});

app.use((req, res, next) => {
    const path = req.path;
    if (path.endsWith('.html')) {
        const newPath = path.slice(0, -5); // Remove .html
        const query = req.url.slice(path.length); // Preserve query params and hash
        return res.redirect(301, newPath + query);
    }
    next();
});

// 2. Then - Serve static files (now protected)
app.use(express.static(__dirname, { extensions: ['html'] }));

// 3. Handle protected norwager.html through explicit route
app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    
    const filePath = path.join(__dirname, 'protected', `${req.path}.html`);
    
    // Check if protected file exists
    if (fs.existsSync(filePath)) {
        // Authentication check
        if (!req.session.isAuthenticated) {
            return res.status(403).send('Access denied');
        }
        // Serve protected file
        res.sendFile(filePath, { headers: { 'Cache-Control': 'no-store' } });
    } else {
        next(); // Continue to other routes
    }
});

// Existing routes and middleware
app.use('/', authRouter);

// URL Trimming Middleware
app.use((req, res, next) => {
    const trimmedUrl = req.url.replace(/\/$/, '');
    if (trimmedUrl !== req.url) {
        return res.redirect(301, trimmedUrl);
    }
    next();
});

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});