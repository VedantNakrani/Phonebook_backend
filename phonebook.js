const { res } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

let persons = [
    
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
    {
        "name": "Vedant",
        "number": "8829271231",
        "date": "2020-09-29T16:55:37.314Z",
        "id": 5
    },
    {
        "name": "Asha",
        "number": "9377187381",
        "date": "2020-09-30T13:22:04.466Z",
        "id": 7
    }
]

morgan.token('jsonBody', (req, res) => JSON.stringify(req.body))

const morganLogger = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens['jsonBody'](req, res)
  ].join(' ')
})

app.use(morganLogger)

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.get('/', (req, res) => {
    res.send('<h1>Hello dudy.</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const date = new Date()
    res.send (
        `<h3>Phonebook has info for ${persons.length} people</h3>
        <h3>${date}</h3>`
    )
})

app.get('/api/persons/:id', (req, res) => {
    
    const id = Number(req.params.id)
    const person = persons.find(per => per.id === id)
    if(person) {
        res.json(person)
    }
    else
        res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(per => per.id !== id)
    res.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(per => per.id))
    : 0
    return maxId + 1
}

app.post('/api/persons', (req, res) => {
    const per = req.body
    
    if(!per.name) {
        return res.status(402).json ({
            error: 'name missing'
        })
    }
    if(!per.number) {
        return res.status(402).json ({
            error: 'number missing'
        })
    }
    if(persons.some(p => p.name === per.name)) {
        return res.status(401).json ({
            error: 'name already exists.'
        })
    }
    const person = {
        id: generateId(),
        name: per.name,
        number: per.number
    }
    persons = persons.concat(person)
    res.json(person)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})