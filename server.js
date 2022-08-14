const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

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

app.post('/register', async(req,res)=>{
    try{
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        })

        res.redirect('/login')
    }catch{
        res.redirect('/register')
    }
})

app.listen(3000)