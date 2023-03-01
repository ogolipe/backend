import express from "express"
import mysql from "mysql"
import cors from "cors"

 const app = express ()

 process.env.DB_HOST = "localhost";
 process.env.DB_USERNAME = "root";
 process.env.DB_PASSWORD = "123";
 process.env.DB_DBNAME = "riole";

 const db = mysql.createPool({
   host: process.env.DB_HOST,
   user: process.env.DB_USERNAME,
   password:process.env.DB_PASSWORD,
   database: process.env.DB_DBNAME,
   waitForConnections : true,
   connectionLimit:10,
   queueLimit: 0
})

db.getConnection((err,conn) => {
   if(err) console.log(err)
   console.log("Connected successfully");

})

 /*const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"123",
    database:"riole"
 })*///codigo para conexão com o banco de dados
 
 app.use(express.json())/*permite enviar qualquer arquivo json usando um 
 client( codigo usado para corrigir erro de fazer post no body do postman)*/
 app.use(cors())//permitir que uma aplicação use a api 

 app.get("/", (req, res) => {
    res.json("hello MESMO??")
 })

 app.get("/eventos", (req, res) => {
    const q = "SELECT * FROM eventos"
    db.query(q, (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    })//criei um query q vai me retornar um erro(se tiver), 
    //ou, se der tudo certo retornara os dados
 })


 app.post("/eventos", (req, res) => {
   const q = "INSERT INTO eventos (`nome`, `banner`, `valor_min`, `descricao`, `nome_categoria`) VALUES (?)"/*poderia colocar no lugar da "?" os values
   que no caso seriam title, desc, etc...*/
   const values = [ req.body.nome, req.body.banner, req.body.valor_min, req.body.descricao, req.body.nome_categoria ]//aqui pegando valores do body do postman
   // const values  = ["title from backend", "desc from backend","cover from backend"]/*esa parte o usuario que vai 
   // disponibilizar, mas como teste inseri no backend e depois comentei*/

   db.query(q, [values], (err, data) => {
       if(err) return res.json(err)
       return res.json("evento has been created")
   })
})

app.delete("/eventos/:id", (req, res)=>{
   const eventoId = req.params.id//para pegar o id, o params representa a url acima e o .id representa a id acima
   const q = "DELETE FROM eventos WHERE id = ?"

   db.query(q,[eventoId], (err, data) => {
      if (err) return res.json(err)
      return res.json("role has been deleted succesfully")
   })
})

//update
app.put("/eventos/:id", (req, res)=>{
   const eventoId = req.params.id//para pegar o id, o params representa a url acima e o .id representa a id acima
   const q = "UPDATE eventos SET `nome` = ?, `banner`= ?, `valor_min`  = ?, `descricao` = ? WHERE id = ?"

   const values = [ req.body.nome, req.body.banner, req.body.valor_min, req.body.descricao ]

   db.query(q,[...values, eventoId], (err, data) => {
      if (err) return res.json(err)
      return res.json("role has been updated succesfully")
   })
})

app.get("/filtro/gratuito", (req, res) => {
   const q = "SELECT * FROM eventos WHERE `valor_min` = 0"
   db.query(q, (err, data) => {
     if(err) return res.json(err)
     return res.json(data)
   })
 })

 app.get("/filtro/30", (req, res) => {
   const q = "SELECT * FROM eventos WHERE `valor_min` <= 31"
   db.query(q, (err, data) => {
     if(err) return res.json(err)
     return res.json(data)
   })
 })

 app.get("/filtro/100", (req, res) => {
   const q = "SELECT * FROM eventos WHERE `valor_min` <= 101"
   db.query(q, (err, data) => {
     if(err) return res.json(err)
     return res.json(data)
   })
 })
 
 app.get("/filtro/ceu", (req, res) => {
   const q = "SELECT * FROM eventos WHERE `valor_min` > 100"
   db.query(q, (err, data) => {
     if(err) return res.json(err)
     return res.json(data)
   })
 })

 app.listen(3000, () => {
    console.log("connected to backend")
 })