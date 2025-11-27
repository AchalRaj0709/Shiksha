import { useState } from 'react';
import './CategoryNav.css';

function CategoryNav() {
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = [
        'All',
        'Development',
        'Business',
        'Design',
        'Marketing',
        'IT & Software',
        'Personal Development',
        'Photography',
        'Music',
        'Health & Fitness'
    ];

    return (
        <div className="category-nav">
            <div className="container">
                <div className="category-scroll">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CategoryNav;
