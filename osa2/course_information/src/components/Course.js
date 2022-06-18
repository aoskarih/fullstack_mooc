
const Header = ({ text }) => <h2>{text}</h2>

const Total = ({ sum }) => <p><b>Total of {sum} exrecises</b></p>

const Part = ({ part }) => 
    <p>
        {part.name} {part.exercises}
    </p>

const Content = ({ parts }) => 
    <>
        {parts.map((p => <Part key={p.id} part={p}/>))}    
    </>

const Course = ({ course }) => {
    return (
        <div>
            <Header text={course.name} />
            <Content parts={course.parts} />
            <Total sum={course.parts.map(p => p.exercises).reduce((a, b) => a+b, 0)} />
        </div>
    )
}

export default Course
