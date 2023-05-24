import express from 'express';

const app = express();

app.use(express.json())

/* 
GET - buscar uma info dentro do servidor
POST - inserir uma info no servidor
PUT - alterar uma info no servidor
PATCH - altera uma info específica
DELETE - deleta uma info no servidor
*/

/*
TIPOS DE PARAMETROS
i) Route Params => identificar um recurso para editar/deletar/buscar [:id]
ii) Query Params => Paginação/Filtro [?page=1&order=asc]
iii) Body Params => Objetos de inserção/alteração (JSON)
*/

app.get('/courses', (req, res) => {
    return res.json(["curso python", "curso js", "curso java"])
})

app.post('/courses', (req, res) => {
    return res.json(["curso python", "curso js", "curso java", "curso C#"])
})

app.put('/courses/:id', (req, res) => {
    return res.json(["curso php", "curso js", "curso java", "curso C#"])
})

app.patch('/courses/:id', (req, res) => {
    return res.json(["curso php", "curso nodejs", "curso java", "curso C#"])
})

app.delete('/courses/:id', (req, res) => {
    return res.json(["curso php", "curso nodejs", "curso C#"])
})

const port = 3333
app.listen(port)