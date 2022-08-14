const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))


const users = []

app.get('/', (req,res)=>{
    res.render('index')
})

app.get('/login', (req,res)=>{
    res.render('login')
})

app.post('/login', (req,res)=>{
    
})

app.get('/register', (req,res)=>{
    res.render('register')
})

app.post('/register', (req,res)=>{
    
})

app.listen(3000)