var connection = mysql.createConnection({
    host: "db-rds.ctnzbbrspe3m.us-west-2.rds.amazonaws.com",
    user: "masterUsername",
    database: "assignment1_db",
    multipleStatements: true
});
connection.connect((err) => {
    if(!err) {
        console.log("connected");
    } else {
        console.log("Connection Failed");
    }

});
