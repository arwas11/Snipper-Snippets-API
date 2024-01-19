// const {snippets} = require("./seedData.json");
// const {users} = require("./usersData.json");

// const {db} = require('./db.js');
// const {User, Snippet} = require('../models')


// const seed = async () => {
//     try {
//         // await db.sync()
//         await db.sync({force: true})

//         await Promise.all(snippets.map(snippet => Snippet.create(snippet)))
//         // await Promise.all(users.map(user => User.create(user)))

//         console.log('db seeded!');
//     } catch (error) {
//         console.log(error);
//     }
// }

// seed();