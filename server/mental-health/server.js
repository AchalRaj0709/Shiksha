const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helper function to read JSON data
const readData = (filename) => {
    const filePath = path.join(__dirname, 'data', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

// ==================== API ROUTES ====================

// Get random quote
app.get('/api/quotes', (req, res) => {
    try {
        const data = readData('quotes.json');
        const randomQuote = data.quotes[Math.floor(Math.random() * data.quotes.length)];
        res.json({ success: true, data: randomQuote });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all tips or shuffle
app.get('/api/tips', (req, res) => {
    try {
        const data = readData('tips.json');
        let tips = data.tips;

        // Shuffle if requested
        if (req.query.shuffle === 'true') {
            tips = tips.sort(() => Math.random() - 0.5);
        }

        res.json({ success: true, data: tips });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all meditation sessions
app.get('/api/meditations', (req, res) => {
    try {
        const data = readData('meditations.json');
        res.json({ success: true, data: data.meditations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== PAGE ROUTES ====================

// Dashboard - Main wellbeing page
app.get('/wellbeing', (req, res) => {
    res.render('dashboard', {
        title: 'MindEase - Mental Wellness Dashboard',
        page: 'dashboard'
    });
});

// Breathing exercises page
app.get('/wellbeing/breathing', (req, res) => {
    res.render('breathing', {
        title: 'Breathing Exercises - MindEase',
        page: 'breathing'
    });
});

// Meditation page
app.get('/wellbeing/meditation', (req, res) => {
    try {
        const data = readData('meditations.json');
        res.render('meditation', {
            title: 'Meditation - MindEase',
            page: 'meditation',
            meditations: data.meditations
        });
    } catch (error) {
        res.status(500).send('Error loading meditation data');
    }
});

// Study tips page
app.get('/wellbeing/tips', (req, res) => {
    try {
        const data = readData('tips.json');
        res.render('tips', {
            title: 'Study Pressure Management - MindEase',
            page: 'tips',
            tips: data.tips
        });
    } catch (error) {
        res.status(500).send('Error loading tips data');
    }
});

// Motivational quotes page
app.get('/wellbeing/quotes', (req, res) => {
    try {
        const data = readData('quotes.json');
        const randomQuote = data.quotes[Math.floor(Math.random() * data.quotes.length)];
        res.render('quotes', {
            title: 'Motivational Resources - MindEase',
            page: 'quotes',
            quote: randomQuote
        });
    } catch (error) {
        res.status(500).send('Error loading quotes data');
    }
});

// Root redirect
app.get('/', (req, res) => {
    res.redirect('/wellbeing');
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start server
app.listen(PORT, () => {
    console.log(`🧘 Mental Health Module running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/wellbeing`);
    console.log(`🌬️  Breathing: http://localhost:${PORT}/wellbeing/breathing`);
    console.log(`🧘 Meditation: http://localhost:${PORT}/wellbeing/meditation`);
    console.log(`💡 Tips: http://localhost:${PORT}/wellbeing/tips`);
    console.log(`✨ Quotes: http://localhost:${PORT}/wellbeing/quotes`);
});
