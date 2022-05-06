const express = require("express");
const app = express()

const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passporLocal = require('passport-local').Strategy

app.set('port', process.env.PORT || 5000)
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(cookieParser('mysecret'))

app.use(session({
    secret: 'mysecret',
    resave: true, // EN CADA PETICION SIN SER MODIFICADA LA SESSION LA GUARDA
    saveUninitialized: true // INICIAMOS UNA SESSION Y NO LE GUARDAMOS NADA AÚN ASÍ SE GUARDA
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passporLocal(function(username, password, done){
    if(username === "dorko" && password === "1234")
        return done(null, {id: 1, name: 'Cody'})

    done(null, false)
    
}))

// SERIALIZAR == PASAR TODO EL OBJETO DEL USUARIO {id: 1, name: 'Dorko'} A UN DATO MUY ESPECIFICO Y PARTICULAR DEL USUARIO
// DESSERIALIZAR == PASAR DEL DATO ESPECIFICO A TOOD EL OBJETO DEL USARIO {id: 1, name: 'Dorko'}

// SERIALIZACION
passport.serializeUser(function(user,done){
    done(null, user.id)
})

// DESERIALIZACIÓN
passport.deserializeUser(function(id, done) {
    done(null, {id: 1, name: 'Dorko'})
})

// RUTAS


app.get('/', (req,res,next) => {
    if(req.isAuthenticated()) return next();

    res.redirect('login')
}, (req,res) => {
    //LOGGED
    res.send('Hola')
})

app.get('/login', (req,res) => {
    // FORM
    res.render('login')
})

app.post('/login', passport.authenticate('local',{
    successRedirect : '/',
    failureRedirect: '/login'
}));

//  STARTING THE SERVER
app.listen(app.get('port'), () => {
    console.log('Server Started');
})