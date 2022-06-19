import { useState, useEffect } from 'react'
import service from './services/comm'

const Person = ({ person, personSetter }) => {
  const handleClick = () => {
    if (window.confirm(`Do you really want to delete person ${person.name}?`)) {
      service.deletePerson(person.id)
        .then(_ => {
          console.log("Person deleted", person);
          service.getPersons()
            .then(data => {
              personSetter(data)
            })
        })
    }
  }

  return (
    <>
    {person.name} {person.number}
    <button onClick={handleClick}>delete</button>
    <br />
    </>
  )
}

const Persons = ({ filterStr, persons, personSetter }) => {
  const filterShown = () => {
    return persons.filter(p => p.name.includes(filterStr))
  }
  return (
    <>
      {filterShown().map(p => <Person key={p.name} person={p} personSetter={personSetter}/>)}
    </>
  )
}

const PersonForm = ({persons, personSetter, newNumber, newName, numberSetter, nameSetter}) => {
  const nameInBook = () => {
    let bool = persons.reduce((p, c) => c.name===newName || p, false)
    return bool
  }
  const getId = () => {
    return persons.reduce((p, c) => c.name===newName ? c.id : p, -1)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }

    if (nameInBook()) {
      if (window.confirm(`${newName} is already added to phonebook. Do you want to update the number?`)) {
        service.updatePerson(getId(), personObject)
          .then(response => {
            console.log("Person updated", response)
            service.getPersons()
              .then(data => {
                personSetter(data)
              })
            nameSetter('')
            numberSetter('')
          })
      }

      return
    }

    service.addPerson(personObject)
      .then(response => {
        console.log("Person added", response)
        personSetter(persons.concat(personObject))
        nameSetter('')
        numberSetter('')
      })

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

  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  
  const [filterStr, setFilterStr] = useState('')

  useEffect(() => {
    service.getPersons().then(data => {
        setPersons(data)
    })
  }, [])

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
        personSetter={setPersons} 
        filterStr={filterStr} 
      />
    </div>
  )
}

export default App
