import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import Course from './models/Course.js';
import User from './models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

// ============================================================
// 30 Courses across ALL 10 categories defined in Course model:
// Development, Business, Design, Marketing, IT & Software,
// Personal Development, Photography, Music,
// Health & Fitness, Teaching & Academics
// ============================================================

const coursesData = [
    // ==================== DEVELOPMENT (4) ====================
    {
        title: "Complete Web Development Bootcamp 2024",
        description: "Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB from absolute scratch. Build 20+ real-world projects including an e-commerce platform, social media app, and portfolio website. This comprehensive course covers everything from frontend to backend development.",
        instructorName: "Dr. Angela Yu",
        category: "Development",
        level: "Beginner",
        price: 499,
        originalPrice: 3499,
        rating: 4.8,
        students: 18540,
        duration: "65 hours",
        featured: true,
        trending: true,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
        whatYouWillLearn: ["Build 20+ real projects", "Master HTML, CSS, JavaScript", "Learn React and Node.js", "Deploy apps to production"],
        requirements: ["No programming experience needed", "A computer with internet access"]
    },
    {
        title: "Modern JavaScript: From Fundamentals to Advanced",
        description: "Deep dive into JavaScript ES6+. Learn closures, prototypes, async/await, modules, and modern tooling. Includes real-world coding challenges and a final capstone project.",
        instructorName: "Jonas Schmedtmann",
        category: "Development",
        level: "Intermediate",
        price: 399,
        originalPrice: 2499,
        rating: 4.7,
        students: 9200,
        duration: "28 hours",
        featured: false,
        trending: true,
        bestseller: false,
        image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&q=80",
        whatYouWillLearn: ["Master ES6+ features", "Understand closures and prototypes", "Build async applications", "Use modern JavaScript tooling"],
        requirements: ["Basic HTML & CSS knowledge", "Familiarity with programming concepts"]
    },
    {
        title: "Python for Data Science & Machine Learning",
        description: "Learn Python programming alongside NumPy, Pandas, Matplotlib, Scikit-Learn, and TensorFlow. Build real machine learning models and data analysis pipelines from scratch.",
        instructorName: "Jose Portilla",
        category: "Development",
        level: "Intermediate",
        price: 599,
        originalPrice: 3999,
        rating: 4.6,
        students: 14300,
        duration: "42 hours",
        featured: true,
        trending: false,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80",
        whatYouWillLearn: ["Python programming fundamentals", "Data analysis with Pandas", "Machine learning with Scikit-Learn", "Deep learning with TensorFlow"],
        requirements: ["Basic math knowledge", "No programming experience required"]
    },
    {
        title: "React Native: Build Mobile Apps",
        description: "Create stunning cross-platform mobile applications for iOS and Android using React Native. Learn navigation, state management, API integration, and app deployment.",
        instructorName: "Maximilian Schwarzmüller",
        category: "Development",
        level: "Advanced",
        price: 549,
        originalPrice: 2999,
        rating: 4.5,
        students: 6100,
        duration: "35 hours",
        featured: false,
        trending: true,
        bestseller: false,
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
        whatYouWillLearn: ["Build cross-platform mobile apps", "React Native navigation", "State management with Redux", "Publish to App Store & Play Store"],
        requirements: ["Solid JavaScript knowledge", "Basic React experience"]
    },

    // ==================== BUSINESS (3) ====================
    {
        title: "Financial Analysis & Business Valuation",
        description: "Master financial modeling, valuation techniques, and investment analysis. Learn to read balance sheets, income statements, and cash flow statements like a Wall Street analyst.",
        instructorName: "Mohsen Hassan",
        category: "Business",
        level: "Advanced",
        price: 699,
        originalPrice: 4999,
        rating: 4.7,
        students: 4200,
        duration: "18 hours",
        featured: true,
        trending: false,
        bestseller: false,
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
        whatYouWillLearn: ["Financial statement analysis", "Company valuation methods", "Investment portfolio building", "Risk assessment techniques"],
        requirements: ["Basic understanding of finance", "Spreadsheet proficiency"]
    },
    {
        title: "Entrepreneurship: Launch Your Startup",
        description: "Everything you need to take an idea from concept to a funded startup. Learn lean methodology, business planning, pitch deck creation, and fundraising strategies.",
        instructorName: "Chris Haroun",
        category: "Business",
        level: "All Levels",
        price: 449,
        originalPrice: 2999,
        rating: 4.6,
        students: 7800,
        duration: "22 hours",
        featured: false,
        trending: true,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
        whatYouWillLearn: ["Validate your business idea", "Create a business plan", "Build a compelling pitch deck", "Navigate fundraising"],
        requirements: ["No prior business experience needed", "A desire to build something"]
    },
    {
        title: "Project Management Professional (PMP) Prep",
        description: "Comprehensive PMP certification preparation. Covers all knowledge areas, process groups, and agile methodologies tested on the PMP exam. Includes 500+ practice questions.",
        instructorName: "Joseph Phillips",
        category: "Business",
        level: "Intermediate",
        price: 549,
        originalPrice: 3499,
        rating: 4.8,
        students: 5600,
        duration: "35 hours",
        featured: true,
        trending: false,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
        whatYouWillLearn: ["All PMP knowledge areas", "Agile and hybrid methodologies", "500+ practice questions", "Exam-taking strategies"],
        requirements: ["Project management experience recommended", "Commitment to study"]
    },

    // ==================== DESIGN (3) ====================
    {
        title: "Graphic Design Masterclass: From Theory to Practice",
        description: "Learn Photoshop, Illustrator, and InDesign from scratch. Master color theory, typography, layout composition, and branding to create stunning designs for print and digital.",
        instructorName: "Lindsay Marsh",
        category: "Design",
        level: "All Levels",
        price: 450,
        originalPrice: 2999,
        rating: 4.9,
        students: 8900,
        duration: "24 hours",
        featured: true,
        trending: true,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
        whatYouWillLearn: ["Adobe Photoshop, Illustrator, InDesign", "Color theory & typography", "Logo and brand design", "Print & digital design"],
        requirements: ["No design experience needed", "Access to Adobe Creative Suite"]
    },
    {
        title: "UI/UX Design: Complete Figma Course",
        description: "Design beautiful mobile and web interfaces using Figma. Learn user research, wireframing, prototyping, and design systems. Build a professional portfolio of 5 projects.",
        instructorName: "Daniel Scott",
        category: "Design",
        level: "Beginner",
        price: 399,
        originalPrice: 2499,
        rating: 4.7,
        students: 6400,
        duration: "20 hours",
        featured: false,
        trending: true,
        bestseller: false,
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80",
        whatYouWillLearn: ["Figma design tool mastery", "User research methods", "Wireframing and prototyping", "Build a design portfolio"],
        requirements: ["No prior design experience", "Free Figma account"]
    },
    {
        title: "Motion Graphics with After Effects",
        description: "Create professional motion graphics and visual effects. Learn animation principles, kinetic typography, logo reveals, and social media content creation in Adobe After Effects.",
        instructorName: "Louay Zambarakji",
        category: "Design",
        level: "Intermediate",
        price: 499,
        originalPrice: 3199,
        rating: 4.5,
        students: 3200,
        duration: "15 hours",
        featured: false,
        trending: false,
        bestseller: false,
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
        whatYouWillLearn: ["After Effects fundamentals", "Animation principles", "Kinetic typography", "Social media motion content"],
        requirements: ["Basic computer skills", "Adobe After Effects installed"]
    },

    // ==================== MARKETING (3) ====================
    {
        title: "Digital Marketing Strategy 2024",
        description: "Master social media marketing, SEO, YouTube, email marketing, Facebook Ads, Google Ads, Analytics, and content marketing. Build real campaigns with measurable results.",
        instructorName: "Rob Percival",
        category: "Marketing",
        level: "Intermediate",
        price: 299,
        originalPrice: 1999,
        rating: 4.5,
        students: 13500,
        duration: "40 hours",
        featured: true,
        trending: true,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        whatYouWillLearn: ["Social media strategy", "SEO & content marketing", "Paid advertising (FB, Google)", "Email marketing automation"],
        requirements: ["No marketing experience needed", "Willingness to practice"]
    },
    {
        title: "SEO Mastery: Rank #1 on Google",
        description: "Learn the complete SEO process from keyword research to link building. Understand technical SEO, on-page optimization, and content strategy to dominate search rankings.",
        instructorName: "Arun Nagarathanam",
        category: "Marketing",
        level: "Beginner",
        price: 249,
        originalPrice: 1499,
        rating: 4.4,
        students: 5600,
        duration: "12 hours",
        featured: false,
        trending: false,
        bestseller: false,
        image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&q=80",
        whatYouWillLearn: ["Keyword research techniques", "On-page & off-page SEO", "Technical SEO audits", "Link building strategies"],
        requirements: ["Basic internet skills", "A website or blog (optional)"]
    },
    {
        title: "Content Marketing & Copywriting Secrets",
        description: "Write copy that sells. Learn persuasive writing techniques, content strategy frameworks, email sequences, landing page copy, and brand storytelling that converts.",
        instructorName: "Harsh Agrawal",
        category: "Marketing",
        level: "All Levels",
        price: 349,
        originalPrice: 1999,
        rating: 4.6,
        students: 4100,
        duration: "16 hours",
        featured: false,
        trending: true,
        bestseller: false,
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
        whatYouWillLearn: ["Persuasive copywriting formulas", "Content strategy frameworks", "Email marketing sequences", "Landing page optimization"],
        requirements: ["Decent English writing skills", "No marketing background required"]
    },

    // ==================== IT & SOFTWARE (3) ====================
    {
        title: "AWS Certified Solutions Architect",
        description: "Prepare for the AWS Solutions Architect Associate exam. Learn EC2, S3, VPC, Lambda, RDS, DynamoDB, CloudFormation, and more with hands-on labs and practice exams.",
        instructorName: "Stephane Maarek",
        category: "IT & Software",
        level: "Intermediate",
        price: 599,
        originalPrice: 3999,
        rating: 4.8,
        students: 11200,
        duration: "30 hours",
        featured: true,
        trending: true,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
        whatYouWillLearn: ["Core AWS services", "Architecting scalable solutions", "Security best practices", "Hands-on labs & practice exams"],
        requirements: ["Basic IT knowledge", "An AWS free-tier account"]
    },
    {
        title: "Ethical Hacking & Cybersecurity",
        description: "Learn penetration testing, network security, and ethical hacking from scratch. Use tools like Kali Linux, Metasploit, Burp Suite, and Wireshark in a legal, controlled environment.",
        instructorName: "Zaid Sabih",
        category: "IT & Software",
        level: "Beginner",
        price: 499,
        originalPrice: 2999,
        rating: 4.7,
        students: 9800,
        duration: "25 hours",
        featured: false,
        trending: true,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
        whatYouWillLearn: ["Network penetration testing", "Web application security", "Kali Linux & Metasploit", "Security audit methodology"],
        requirements: ["Basic computer skills", "Willingness to learn ethically"]
    },
    {
        title: "Docker & Kubernetes: The Complete Guide",
        description: "Master containerization with Docker and orchestration with Kubernetes. Learn Docker Compose, CI/CD pipelines, Helm charts, and production deployment strategies.",
        instructorName: "Stephen Grider",
        category: "IT & Software",
        level: "Advanced",
        price: 549,
        originalPrice: 3499,
        rating: 4.6,
        students: 5400,
        duration: "22 hours",
        featured: true,
        trending: false,
        bestseller: false,
        image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80",
        whatYouWillLearn: ["Docker fundamentals", "Kubernetes orchestration", "CI/CD pipeline setup", "Production deployment"],
        requirements: ["Basic Linux command line", "Some programming experience"]
    },

    // ==================== PERSONAL DEVELOPMENT (3) ====================
    {
        title: "The Science of Habits & Productivity",
        description: "Transform your daily routine using evidence-based habit formation techniques. Learn time management, deep work practices, goal setting frameworks, and energy management.",
        instructorName: "James Clear",
        category: "Personal Development",
        level: "All Levels",
        price: 199,
        originalPrice: 999,
        rating: 4.8,
        students: 21000,
        duration: "8 hours",
        featured: true,
        trending: true,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
        whatYouWillLearn: ["Habit formation science", "Time management techniques", "Deep work practices", "Goal setting frameworks"],
        requirements: ["No prerequisites", "A notebook for exercises"]
    },
    {
        title: "Public Speaking & Confident Communication",
        description: "Overcome fear and become a confident, compelling speaker. Learn storytelling, body language, vocal techniques, and presentation design for business and personal growth.",
        instructorName: "TJ Walker",
        category: "Personal Development",
        level: "Beginner",
        price: 249,
        originalPrice: 1499,
        rating: 4.5,
        students: 7600,
        duration: "10 hours",
        featured: false,
        trending: false,
        bestseller: false,
        image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
        whatYouWillLearn: ["Overcome stage fright", "Master storytelling", "Body language & vocal control", "Design compelling presentations"],
        requirements: ["No public speaking experience needed", "A camera for practice recordings"]
    },
    {
        title: "Emotional Intelligence: Master Your EQ",
        description: "Develop your emotional intelligence to improve relationships, leadership skills, and personal well-being. Learn self-awareness, empathy, conflict resolution, and emotional regulation.",
        instructorName: "Ramit Sethi",
        category: "Personal Development",
        level: "Intermediate",
        price: 299,
        originalPrice: 1999,
        rating: 4.6,
        students: 4800,
        duration: "12 hours",
        featured: false,
        trending: true,
        bestseller: false,
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
        whatYouWillLearn: ["Self-awareness techniques", "Empathy and active listening", "Conflict resolution skills", "Emotional regulation strategies"],
        requirements: ["Openness to self-reflection", "No prior knowledge needed"]
    },

    // ==================== PHOTOGRAPHY (3) ====================
    {
        title: "Photography Masterclass: Complete Guide",
        description: "Learn photography from beginner to pro. Master your camera settings, composition, lighting, portrait, landscape, and street photography. Includes Lightroom & Photoshop editing.",
        instructorName: "Phil Ebiner",
        category: "Photography",
        level: "All Levels",
        price: 349,
        originalPrice: 2499,
        rating: 4.7,
        students: 10200,
        duration: "30 hours",
        featured: true,
        trending: true,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
        whatYouWillLearn: ["Camera settings & exposure", "Composition techniques", "Portrait & landscape photography", "Lightroom & Photoshop editing"],
        requirements: ["A camera (DSLR, mirrorless, or smartphone)", "No prior photography experience"]
    },
    {
        title: "iPhone Photography: Shoot Like a Pro",
        description: "Take stunning photos and videos with just your iPhone. Learn mobile composition, editing with free apps, social media optimization, and smartphone filmmaking techniques.",
        instructorName: "Dale McManus",
        category: "Photography",
        level: "Beginner",
        price: 199,
        originalPrice: 999,
        rating: 4.5,
        students: 8500,
        duration: "8 hours",
        featured: false,
        trending: true,
        bestseller: false,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
        whatYouWillLearn: ["iPhone camera mastery", "Mobile editing techniques", "Social media content creation", "Smartphone filmmaking"],
        requirements: ["An iPhone or smartphone", "No experience needed"]
    },
    {
        title: "Advanced Portrait Photography & Lighting",
        description: "Master studio and natural lighting for portraits. Learn posing, color grading, retouching workflows, and how to direct subjects for emotional, magazine-quality photos.",
        instructorName: "Peter Hurley",
        category: "Photography",
        level: "Advanced",
        price: 499,
        originalPrice: 3499,
        rating: 4.8,
        students: 2800,
        duration: "16 hours",
        featured: false,
        trending: false,
        bestseller: false,
        image: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80",
        whatYouWillLearn: ["Studio lighting setups", "Natural light techniques", "Professional retouching", "Subject posing and direction"],
        requirements: ["Intermediate photography experience", "Camera with manual controls"]
    },

    // ==================== MUSIC (3) ====================
    {
        title: "Complete Guitar Course: Beginner to Advanced",
        description: "Learn acoustic and electric guitar from zero. Master chords, scales, fingerpicking, strumming patterns, music theory, and play your favorite songs in weeks.",
        instructorName: "Erich Andreas",
        category: "Music",
        level: "Beginner",
        price: 299,
        originalPrice: 1999,
        rating: 4.7,
        students: 11500,
        duration: "35 hours",
        featured: true,
        trending: true,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80",
        whatYouWillLearn: ["Guitar fundamentals & chords", "Fingerpicking and strumming", "Music theory basics", "Play 50+ popular songs"],
        requirements: ["An acoustic or electric guitar", "No music experience needed"]
    },
    {
        title: "Music Production in Ableton Live",
        description: "Produce professional-quality music from your bedroom. Learn Ableton Live, sound design, mixing, mastering, and music theory for electronic music production.",
        instructorName: "Jason Allen",
        category: "Music",
        level: "Intermediate",
        price: 399,
        originalPrice: 2499,
        rating: 4.6,
        students: 4300,
        duration: "20 hours",
        featured: false,
        trending: false,
        bestseller: false,
        image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
        whatYouWillLearn: ["Ableton Live mastery", "Sound design fundamentals", "Mixing & mastering", "Create complete tracks"],
        requirements: ["Ableton Live (trial is fine)", "Basic understanding of music"]
    },
    {
        title: "Piano for Beginners: Play Songs in 30 Days",
        description: "Start playing piano today with a structured, step-by-step approach. Learn to read sheet music, play chords, and perform classical and pop pieces within the first month.",
        instructorName: "Robin Hall",
        category: "Music",
        level: "Beginner",
        price: 249,
        originalPrice: 1499,
        rating: 4.8,
        students: 6700,
        duration: "14 hours",
        featured: true,
        trending: false,
        bestseller: false,
        image: "https://images.unsplash.com/photo-1520523839897-bd33cd2e969a?w=800&q=80",
        whatYouWillLearn: ["Read sheet music", "Play chords and scales", "Perform 20+ songs", "Music theory fundamentals"],
        requirements: ["A piano or keyboard", "No prior music experience"]
    },

    // ==================== HEALTH & FITNESS (3) ====================
    {
        title: "Complete Yoga Journey: Mind, Body & Spirit",
        description: "Practice yoga for strength, flexibility, and peace of mind. Learn over 100 poses, breathing techniques, meditation practices, and how to build your own daily routine.",
        instructorName: "Adriene Mishler",
        category: "Health & Fitness",
        level: "All Levels",
        price: 199,
        originalPrice: 999,
        rating: 4.9,
        students: 16800,
        duration: "25 hours",
        featured: true,
        trending: true,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
        whatYouWillLearn: ["100+ yoga poses", "Breathing techniques", "Meditation practices", "Build a daily yoga routine"],
        requirements: ["A yoga mat", "No fitness experience needed"]
    },
    {
        title: "Nutrition Science & Healthy Meal Planning",
        description: "Understand macronutrients, micronutrients, meal timing, and evidence-based nutrition. Learn to create personalized meal plans for weight loss, muscle gain, or general health.",
        instructorName: "Dr. Sarah Chen",
        category: "Health & Fitness",
        level: "Beginner",
        price: 249,
        originalPrice: 1499,
        rating: 4.6,
        students: 5200,
        duration: "10 hours",
        featured: false,
        trending: true,
        bestseller: false,
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
        whatYouWillLearn: ["Understand macros & micros", "Create personalized meal plans", "Evidence-based nutrition", "Healthy cooking techniques"],
        requirements: ["No prior nutrition knowledge", "Interest in healthy living"]
    },
    {
        title: "Home Workout: Build Muscle Without a Gym",
        description: "Get fit at home with no equipment. Learn progressive calisthenics, HIIT workouts, mobility routines, and periodization to build strength and endurance anywhere.",
        instructorName: "Jeff Cavaliere",
        category: "Health & Fitness",
        level: "Intermediate",
        price: 299,
        originalPrice: 1999,
        rating: 4.7,
        students: 8900,
        duration: "12 hours",
        featured: false,
        trending: false,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
        whatYouWillLearn: ["Bodyweight exercises", "HIIT training protocols", "Mobility & flexibility", "Progressive overload techniques"],
        requirements: ["No equipment needed", "Basic fitness level recommended"]
    },

    // ==================== TEACHING & ACADEMICS (3) ====================
    {
        title: "Complete Mathematics: From Basics to Calculus",
        description: "Master math from arithmetic through algebra, geometry, trigonometry, and calculus. Perfect for students preparing for competitive exams, college admissions, or self-improvement.",
        instructorName: "Krista King",
        category: "Teaching & Academics",
        level: "All Levels",
        price: 349,
        originalPrice: 1999,
        rating: 4.7,
        students: 9400,
        duration: "50 hours",
        featured: true,
        trending: true,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
        whatYouWillLearn: ["Arithmetic to calculus", "Problem-solving strategies", "Competitive exam preparation", "Mathematical thinking skills"],
        requirements: ["No math background needed", "Willingness to practice"]
    },
    {
        title: "English Grammar & Academic Writing",
        description: "Improve your English writing for academic and professional contexts. Learn grammar rules, essay structure, research writing, and how to communicate clearly and persuasively.",
        instructorName: "Shani Raja",
        category: "Teaching & Academics",
        level: "Beginner",
        price: 199,
        originalPrice: 999,
        rating: 4.5,
        students: 7100,
        duration: "15 hours",
        featured: false,
        trending: false,
        bestseller: false,
        image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
        whatYouWillLearn: ["English grammar mastery", "Academic essay writing", "Research paper structure", "Clear and persuasive writing"],
        requirements: ["Basic English reading ability", "Desire to improve writing"]
    },
    {
        title: "IELTS Preparation: Score Band 7+",
        description: "Comprehensive preparation for all four IELTS modules: Listening, Reading, Writing, and Speaking. Includes strategies, practice tests, sample answers, and expert feedback techniques.",
        instructorName: "Keino Campbell",
        category: "Teaching & Academics",
        level: "Intermediate",
        price: 399,
        originalPrice: 2499,
        rating: 4.8,
        students: 6300,
        duration: "20 hours",
        featured: true,
        trending: true,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
        whatYouWillLearn: ["All 4 IELTS modules", "High-scoring strategies", "Practice tests with answers", "Speaking mock interviews"],
        requirements: ["Intermediate English level", "Commitment to daily practice"]
    }
];

// ============================================================
// SEEDING FUNCTION
// ============================================================
const seedDB = async () => {
    try {
        console.log('🔌 Connecting to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas successfully!\n');

        // 1. Create a default Instructor user if one doesn't exist
        let instructor = await User.findOne({ role: 'instructor' });
        if (!instructor) {
            console.log('👨‍🏫 Creating default instructor account...');
            instructor = await User.create({
                name: "Shiksha Instructor",
                email: "instructor@shiksha.com",
                password: "password123",
                role: "instructor",
                isEmailVerified: true
            });
            console.log('   ✅ Instructor created: instructor@shiksha.com');
        } else {
            console.log('   ℹ️  Instructor already exists, using existing one.');
        }

        // 2. Clear existing courses
        const existing = await Course.countDocuments();
        console.log(`\n🗑️  Removing ${existing} existing courses...`);
        await Course.deleteMany({});

        // 3. Attach instructor ID to each course
        const finalCourses = coursesData.map(course => ({
            ...course,
            instructor: instructor._id
        }));

        // 4. Insert all courses
        console.log(`\n📚 Inserting ${finalCourses.length} courses across 10 categories...\n`);
        const inserted = await Course.insertMany(finalCourses);

        // 5. Summary
        const categories = [...new Set(inserted.map(c => c.category))];
        console.log('='.repeat(50));
        console.log('🚀 DATABASE SEEDED SUCCESSFULLY!');
        console.log('='.repeat(50));
        console.log(`   Total courses: ${inserted.length}`);
        console.log(`   Categories: ${categories.length}`);
        categories.forEach(cat => {
            const count = inserted.filter(c => c.category === cat).length;
            console.log(`     • ${cat}: ${count} courses`);
        });
        console.log('='.repeat(50));

        process.exit();
    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        process.exit(1);
    }
};

seedDB();
