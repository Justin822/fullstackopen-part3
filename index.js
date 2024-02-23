const express = require("express");
const morgan = require("morgan");

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

const app = express();
app.use(
  morgan(`:method :url :status :res[content-length] :response-time ms :body`)
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// const requestLogger = (request, response, next) => {
//   console.log("Method:", request.method);
//   console.log("Path:", request.path);
//   console.log("Body:", request.body);
//   console.log("---");
//   next();
// };

app.use(express.json());
// app.use(requestLogger);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const generateId = () => {
  return Math.floor(Math.random() * 999999);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name is missing",
    });
  }

  if (!body.phone) {
    return response.status(400).json({
      error: "phone is missing",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    phone: body.phone,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    return response.json(person);
  } else {
    return response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.find((person) => person.id === id);

  response.status(204).end();
});

app.get("/info", (request, response) => {
  const numberOfPersons = persons.length;

  const date = new Date().toUTCString();

  response.send(
    `   <p>Phonebook has info for ${numberOfPersons} people.</>
        <p>${date}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
