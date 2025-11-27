import CourseCard from './CourseCard';
import './CourseGrid.css';

function CourseGrid({ title, courses }) {
    return (
        <section className="course-grid-section">
            <div className="container">
                {title && <h2 className="section-title">{title}</h2>}
                <div className="course-grid">
                    {courses.map((course) => (
                        <CourseCard key={course._id || course.id} course={course} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CourseGrid;
