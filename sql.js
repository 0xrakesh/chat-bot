const sqlite3 = require("sqlite3")
const db = new sqlite3.Database("./information.db")

var createdatabase = "CREATE TABLE IF NOT EXISTS details (name TEXT, id INTEGER)"

var insertdata = "INSERT INTO details(name,id) VALUES (?,?)"

var updatedata = "UPDATE details SET id = ? WHERE name = ?"

var deletedata = "DELETE FROM details WHERE id = ?"

var selectdata = "SELECT name,message,time FROM details"

// db.run(createdatabase)
// db.run(insertdata,["Rakesh",1])
db.all(selectdata, (err,rows) => {
    if (err) throw err;
    rows.forEach( function(row)  {
        console.log(row.name,row.message,row.time)
    })
})