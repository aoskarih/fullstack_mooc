import { useState } from 'react'

const Header = ({ text }) => {
    return (
        <>
        <h1>{text}</h1>
        </>
    )
}

const Button = ({text, setter, state}) => {
    const handleClick = () => {
        setter(state+1)
    }
    return (
        <>
        <button onClick={handleClick}>
            {text}
        </button>
        </>
    )
}

const Result = ({ text, value, unit }) => {
    return (
        <>
        <tr>
            <td>{text}</td>
            <td>{value} {unit}</td>
        </tr>
        </>
    )
}

const Statistics = ({ good, neutral, bad }) => {
    
    const all = good+neutral+bad
    const average = (good-bad)/all
    const positive = good/all * 100

    if (all !== 0) {
        return (
            <>
            <table>
            <tbody>
            <Result text={"good"} value={good} />
            <Result text={"neutral"} value={neutral} />
            <Result text={"bad"} value={bad} />
            <Result text={"all"} value={all} />
            <Result text={"average"} value={average} />
            <Result text={"positive"} value={positive} unit={"%"}/>
            </tbody>
            </table>
            </>
        )
    }
    return (
        <>
        No feedback given
        </>
    )
}

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)



    return (

        <div>
        <Header text={"Give feedback"} />
        <Button text={"good"} setter={setGood} state={good} />
        <Button text={"neutral"} setter={setNeutral} state={neutral} />
        <Button text={"bad"} setter={setBad} state={bad} />
        <Header text={"Statistics"} />
        <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

export default App