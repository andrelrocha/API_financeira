import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

const customers = [];

//Middleware
function verifyIfExistsAccountCPF(req, res, next) {
    const { cpf } = req.headers;

    const customer = customers.find((customer) => customer.cpf === cpf);

    if(!customer) {
        return res.status(400).json({ error: "Customer not found" });
    }

    //passa a variavel para o req do middleware, podendo ser chamado fora de seu escopo
    req.customer = customer;

    return next();
}

function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
        if (operation.type === 'credit') {
            return acc + operation.amount
        } else if (operation.type === 'debit') {
            return acc - operation.amount
        }
    }, 0) 

    return balance;
}

/* 
cpf - string - recebe pelo body
name - string - recebe pelo body
id - uuid
statement - []
*/
app.post('/account', (req, res) => {
    const { cpf, name } = req.body;

    const customersAlreadyExists = customers.some((customer) => customer.cpf === cpf);

    if (customersAlreadyExists) {
        return res.status(400).json({error: "Customer's cpf already exists on our database!"});
    }

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: [],
    });

    return res.status(201).send();
})

//app.use(verifyIfExistsAccountCPF)  - aplica o middleware a todas as rotas posteriores
app.get('/statement', verifyIfExistsAccountCPF, (req, res) => {
    //recuperando a informaçao do middleware
    const { customer } = req;

    return res.json(customer.statement);
})
/* 
app.get('/statement/:cpf', (req, res) => {
    const { cpf } = req.params;
})
*/

app.post('/deposit', verifyIfExistsAccountCPF, (req, res) => {
    const { description, amount } = req.body;

    const { customer } = req;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation);

    return res.status(201).send();
})

app.post('/withdraw', verifyIfExistsAccountCPF, (req, res) => {
    const { amount } = req.body;
    const { customer } = req;

    const balance = getBalance(customer.statement);
    const insufficientBalance = balance < amount;

    if (insufficientBalance) {
        return res.status(400).json({error: "Insufficient funds for the operation requested!"})
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit"
    }

    customer.statement.push(statementOperation);

    return res.status(201).send();
})

const port = 3333;
app.listen(port);