//import the express library
const express = require( 'express');
const fs = require( 'fs')
const PORT = 8089;

const app = express();
app.use(express.json())

app.get( '/', (req, res) => {
    res.json( {
        status: "ok",
        message: "Welcome to my contact list"
    })

});

function readDatabase () {
    const database = fs.readFileSync("./contact.json");
    return JSON.parse(database);
}


function writeDatabase (data) {
    fs.writeFileSync("./contact.json", JSON.stringify(data))
}

//get users
app.get("/user", (req, res) => {
    const users = readDatabase();
    res.json( {
        data: users,
        size: users.user.length
    });
});

//get one user
app.get( "/user/:id", (req, res) => {
    const database = readDatabase();
    const userId = parseInt(req.params.id);
    const user = database.user.find( (item) => (item.id === userId));
     if ( !user) {
     res.status(404).json ({
            message: "user not found."
        });
    }
    else {
        res.status( 200).json({
            data: user
        });
    }
})

//CREATE NEW USER
app.post( '/user', (req, res) => {
    const database = readDatabase();
    const newUser = req.body;
    newUser.id = database.user.length + 1;
    database.user.push ( newUser);
    writeDatabase( database);
    res.status(201).json ({
        newData: newUser
    })
})


//update users in the json datsbase
app.put( "/user/:id", (req, res) => {
    const database = readDatabase();
    const userId = parseInt(req.params.id);
    const upddatedUser = req.body;
    const index = database.user.findIndex( (item) => (item.id === userId));
    if ( index !== -1) {
        database.user[index] = {...database.user[index], ...upddatedUser }
        writeDatabase( database)
        res.status(200).json( {
            data: database.user[index]
        });
    } else {
        res.send("wrong id sent")
    }
});


//delete users in json database
app.delete("/user/:id", (req, res) => {
    const database = readDatabase();
    const userId = parseInt(req.params.id);
    const index = database.user.findIndex( (item) => (item.id === userId));
    if ( !database.user[0]) {
        res.status( 404).json( {
            message: `This id ${userId} does not exist`
        })
    } else{
        deletedUser = database.user[index]
        database.user.splice(index, 1)
        writeDatabase(database);
        res.status(200).json( {
            deleteData: deletedUser
        })
    }
})

app.listen(PORT, () => {
    console.log(`App listening at http://localhost: ${PORT}`)
});