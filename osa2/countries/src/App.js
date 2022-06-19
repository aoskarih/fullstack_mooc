import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ filterStr, filterSetter }) => {

  const setFilter = (event) => {
    filterSetter(event.target.value)
  }

  return (
    <>
      find countries <input
        value={filterStr} 
        onChange={setFilter}
      />
    </>
  )
}

const CountryList = ({ countries }) => {
  return (
    <>
      {countries.map(c => <SimpleInfo key={c.name.common} country={c} />)}
    </>
  )
}

const SimpleInfo  = ({ country }) => {
  const [showFull, setShowFull] = useState(0)

  const handleClick = () => {
    setShowFull(!showFull)
  }

  return (
    <>
      {country.name.common}
      <button onClick={handleClick}>
        show
      </button>
      {showFull ? <FullInfo country={country} /> : <></>}
      <br />
    </>
  )

}

const Weather = ({ country }) => {
  const api_key = process.env.REACT_APP_API_KEY
  const [weatherData, setWeatherData] = useState('')
  let city = country.capital[0]

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`)
      .then(response => {
        setWeatherData(response.data)
      })
  }, [])
  if (weatherData !== '') {
    return (
      <>
        <h3>Weather in {country.capital[0]}</h3>
        Temp: {Math.round(weatherData.main.temp-273.15)} Celcius
        <br />
        <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} />
        <br />
        Wind: {weatherData.wind.speed}
      </>
    )
  }
  return (
    <>
      <h3>Weather in {country.capital[0]}</h3>
    </>
  )
}

const FullInfo = ({ country }) => {

  return (
    <>
      <h2>{country.name.common}</h2>
      capital {country.capital[0]} <br />
      area {country.area}

      <h3>Languages</h3>
      <ul>   
        {Object.entries(country.languages).map(l => <li key={l[1]}>{l[1]}</li>)}
      </ul>
      
      <img src={country.flags.png}/>
    </>
  )

}

const Results = ({ filterStr, countries }) => {
  
  const shown = countries.filter(c => 
    c.name.common.toLowerCase().includes(filterStr.toLowerCase())
  )
  
  if (shown.length === 1) {
    return (
      <>
        <FullInfo country={shown[0]} />
        <Weather country={shown[0]} />
      </>
    )
  }
  
  if (shown.length > 10) {
    return (
      <>
        Too many matches ({shown.length}), specify another filter
      </>
    )
  }
  return (
    <>
      <CountryList countries={shown} />
    </>
  )
}


const App = () => {

  const [countries, setCountries] = useState([]) 
  const [filterStr, setFilterStr] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  return (
    <div>
      <Filter  
        filterSetter={setFilterStr}
        filterStr={filterStr}
      />
      <br />
      <Results filterStr={filterStr} countries={countries} />
    </div>
  )
}

export default App
