const express = require('express');
const bodyParser =require('body-parser')
const mongoose = require('mongoose');
const alert= require('alert');
const app= express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));

app.set('view engine', 'ejs');

let flag=0;

mongoose.connect("mongodb://127.0.0.1:27017/bankCustomer",
 {useNewUrlParser:true, useFindAndModify:true,
    useUnifiedTopology:true
 }).then(() => console.log('db connection done'))


 const usersSchema = {
    name : String,
    email : String,
    balance : Number,
    accountNo : Number
}

const User = mongoose.model('User', usersSchema);

const user1 = new User({
    name: "Swapnil Singh",
    email: "sujal10sty@gmail.com",
    balance: 100000,
    accountNo: 12015951
})

const user2 = new User({
    name: "Sonal Singh",
    email: "amro05@gmail.com",
    balance: 100000,
    accountNo: 12015952
})
const user3 = new User({
    name: "Dileep Singh",
    email: "shashankshekhar@gmail.com",
    balance: 100000,
    accountNo: 12015953
})

const user4 = new User({
    name: "Ananya Pandey",
    email: "nakhun.kala.lover@gmail.com",
    balance: 100000,
    accountNo: 12015954
})

const user5 = new User({
    name: "Ayushi Pandey",
    email: "cchandini@gmail.com",
    balance: 100000,
    accountNo: 12015955
})

const user6 = new User({
    name: "Harsh Singh",
    email: "shekharsurya@gmail.com",
    balance: 100000,
    accountNo: 12015956
})

const userArray = [user1, user2, user3, user4, user5, user6];

var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();
let day = today.toLocaleDateString("en-US", options);

const history = [];
let amount = 0;


 app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
})

app.get('/get-started', (req, res) => {
    
    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {
                if(err) console.log(err);
            })
        } else {
            res.render('get-started', {
                balance : foundUsers[0].balance
            })
        }
    } )
    
})

app.get('/add', (req, res) => {
    User.find({}, (err, foundUsers) => {
        res.render('add', {
            balance: foundUsers[0].balance
        })
    })
})

app.get('/transfer', (req, res) => {
    
    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {
                if(err) console.log(err);
            })
        } else {
            res.render('transfer', {
                users : foundUsers,
                balance : foundUsers[0].balance 
            })
        }
    } )
})
app.get('/members', (req, res) => {

    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })

            res.redirect('/members');
        } else {

            res.render('members', {
                users : foundUsers,
                balance : foundUsers[0].balance 
            })
        }
    } )

})


app.post('/get-started', (req, res) => {

    amount = Number(req.body.amount);

    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })
        } else {
            
            if(amount > foundUsers[0].balance) {
                alert('failed')
                res.redirect('/transfer');
            }

            else {
                foundUsers[0].balance -= amount;


                foundUsers[0].save();

            User.findById(req.body.select, (err, found) => {
                found.balance += amount;
                found.save();
                console.log(found.balance)
                history.push({
                    sender : foundUsers[0].name,
                    receiver : found.name,
                    amount : amount,
                    date : day
                })
            })

            alert('successful')
            res.render('get-started', {
                balance : foundUsers[0].balance
            })
            }

        }
    } )

  
})

app.post('/members', (req, res) => {
  
    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })
        } else {

            let newuser = new User({
                name : req.body.name,
                email : req.body.email,
                balance : Number(req.body.balance),
                accountNo : Number(req.body.account)
            })

            foundUsers[0].balance += Number(req.body.money);
            foundUsers[0].save();

           newuser.save();

           res.redirect('/members');

        }
    } )

})
app.get('/add-money', (req, res) => {
    
    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })
        } else {
            res.render('add-money', {
                history : history,
                balance : foundUsers[0].balance 
            })
        }
    } )
})


app.get('/history', (req, res) => {
    
    User.find({}, (err, foundUsers) => {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, (err) => {

            })
        } else {
            res.render('history', {
                history : history,
                balance : foundUsers[0].balance 
            })
        }
    } )

})






// -------x--------Mongoose-------x---------



// ------------------Date-----------------





let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}
app.listen(port,()=>{
    console.log("listening at ${port}");
});