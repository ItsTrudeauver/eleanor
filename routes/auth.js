import { Router } from 'express';

const router = Router();

// Define a simple password (change this to something secure!)
const CORRECT_PASSWORD = 'NORWAGER';

router.post('/validate', async (req, res) => {
    try {
        const { password } = req.body;
        const isValid = password === CORRECT_PASSWORD;

        if (isValid) {
            // Proper session initialization
            req.session.regenerate((err) => {
                if (err) throw err;
                
                req.session.isAuthenticated = true;
                req.session.save((err) => {
                    if (err) throw err;
                    res.json({ valid: true });
                });
            });
        } else {
            res.json({ valid: false });
        }
    } catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/norwager', (req, res) => {
    if (req.session.isAuthenticated) {
        res.sendFile(path.join(process.cwd(), 'norwager.html'), {
            headers: {
                'Cache-Control': 'no-store' // Prevent browser caching
            }
        });
    } else {
        res.status(403).send('Access denied');
    }
});

export default router;
