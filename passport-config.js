const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById){
    passport.use(new LocalStrategy({usernameField: 'email'}, async(email,password,done)=>{
        const user = getUserByEmail(email)
        if(user == null){
            return done(null,false, {message: "No user with that email"})
        }

        try{
            if(await bcrypt.compare(password,user.password)){
                return done(null,user)
            }else{
                return done(null,false, {message: "Incorrect password"})
            }
        }catch(err){
            return done(err)
        }
    })
    
    )

    passport.serializeUser((user, done)=>{
        return done(null, user.id)
    })

    passport.deserializeUser((id, done)=>{
        return done(null, getUserById)
    })

}

module.exports = initialize