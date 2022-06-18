import { useState } from 'react'

const Person = ({ person }) => {
  return (
    <>
    {person.name} {person.number}<br />
    </>
  )
}

const Persons = ({ filterStr, persons }) => {
  const filterShown = () => {
    return persons.filter(p => p.name.includes(filterStr))
  }
  return (
    <>
      {filterShown().map(p => <Person key={p.name} person={p}/>)}
    </>
  )
}

const PersonForm = ({persons, personSetter, newNumber, newName, numberSetter, nameSetter}) => {
  const nameInBook = () => {
    let bool = persons.reduce((p, c) => c.name===newName || p, false)
    return bool
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (nameInBook()) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    const personObject = {
      name: newName,
      number: newNumber,
    }
    personSetter(persons.concat(personObject))
    nameSetter('')
    numberSetter('')
  }
  const handleNameChange = (event) => {
    nameSetter(event.target.value)
  }
  const handleNumberChange = (event) => {
    numberSetter(event.target.value)
  }
  return (
    <>
    <form onSubmit={addPerson}>
      <div>
        name: <input 
          value={newName}
          onChange={handleNameChange}
        /><br />
        number: <input 
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
    </>
  )
}

const Filter = ({ filterStr, filterSetter }) => {

  const setFilter = (event) => {
    filterSetter(event.target.value)
  }

  return (
    <>
      filter shown with <input
        value={filterStr} 
        onChange={setFilter}
      />
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '0401234567'}
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  
  const [filterStr, setFilterStr] = useState('')

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter  
        filterSetter={setFilterStr}
        filterStr={filterStr}
      />
      <h2>add a new</h2>
      <PersonForm 
        newName={newName} 
        newNumber={newNumber}
        persons={persons}
        nameSetter={setNewName} 
        numberSetter={setNewNumber} 
        personSetter={setPersons} 
      />
      <h2>Numbers</h2>
      <Persons 
        persons={persons} 
        filterStr={filterStr} 
      />
    </div>
  )
}

export default App
