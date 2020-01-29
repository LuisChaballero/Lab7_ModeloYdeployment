let express = require( 'express' );
let morgan = require( 'morgan' );
let bodyParser = require( 'body-parser');
let mongoose = require('mongoose');
let jsonParser = bodyParser.json(); //middleware
let { CommentList } = require('./model');
let uuidv4 = require('uuid/v4');
let {DATABASE_URL, PORT} = require( './config'); //importa las dos variables desde config.js



let app = express();

app.use(express.static('public')); // Significa que va a haber una parte publica
app.use( morgan( 'dev' ) );
uuidv4();


 //GET /blog-api/comentarios
 app.get( '/blog-api/comentarios', ( req, res )=>{
     CommentList.getAll()
        .then( comments => {
            return res.status(200).send(comments);
        })
        .catch( error => {
            return Error(error);
        })
    //return res.status( 200 ).json( comentarios );
 });

app.get( '/blog-api/comentarios-por-autor', ( req, res ) =>{

    let autor = req.query.autor;

    if (!autor){
        res.statusMessage = "Nombre de autor no proporcionado";
        return res.status(406).send();
    }

    CommentList.getByAutor(autor)
        .then( result => {
            if (result.length>0){
                return res.status(200).json(result);
            }
            else{
                res.statusMessage = "No hay comentarios de dicho autor";
                return res.status(404).send();
            }
        })
        .catch( error => {
            return Error (error);
        })

 });

 //POST
 app.post( '/blog-api/nuevo-comentario', jsonParser, ( req, res) => {
     console.log(req.body);
     
     let nuevoTitulo = req.body.titulo;
     let nuevoContenido = req.body.contenido;
     let nuevoAutor = req.body.autor;

     if( nuevoAutor == "" || nuevoTitulo == "" || nuevoContenido == "" ){
         res.statusMessage = "Datos incompletos";
         return res.status(406).send();
     }
     else{
        //Current date
        let today = new Date();
        let day = today.getDate();
        let mon = today.getMonth()+1; 
        let year = today.getFullYear();
        if(day<10) day='0'+day;
        if(mon<10) mon='0'+mon;
        let date = year+'-'+mon+'-'+day;

        let nuevoComentario = {
            id: uuidv4(),
            titulo: nuevoTitulo,
            contenido: nuevoContenido,
            autor: nuevoAutor,
            fecha: date
        };
        
        CommentList.createComment( nuevoComentario)
            .then ( comment => {
                res.statusMessage = "comentario agregado"
                return res.status(201).json(nuevoComentario);
            })
            .catch( error => {
                throw Error (error);
            });
     }
 });
 
 //DELETE

 app.delete( '/blog-api/remover-comentario/:id', ( req,res ) => {
    let id = req.params.id;

    CommentList.deleteComment(id)
        .then( result => {
            if (result){
                return res.status(200).send();
            }
            else{
                res.statusMessage = "Id no encontrado";
                return res.status(404).send();
            }
        })
        .catch( error => {
            throw Error ( error );
        });

 });

 app.put( '/blog-api/actualizar-comentario/:id', jsonParser, ( req, res) => {
    let id = req.params.id;
    let urlId = req.body.id;
    let nuevoTitulo = req.body.titulo;
    let nuevoContenido = req.body.contenido;
    let nuevoAutor = req.body.autor;

    if (!urlId){
        res.statusMessage = "El id no fue proporcionado";
        return res.status(406).send();

    }
    else if (urlId != id){
        res.statusMessage = "El id no concuerda";
        return res.status(409).send();
    }
    //else if ( nuevoAutor == "" || nuevoTitulo == "" || nuevoContenido == "" ){
     else if ( !nuevoAutor && !nuevoTitulo  && !nuevoContenido ){

        res.statusMessage = "Datos incompletos";
        return res.status(406).send();
    }
    else{
        //Current date
        let today = new Date();
        let day = today.getDate();
        let mon = today.getMonth()+1; 
        let year = today.getFullYear();
        if(day<10) day='0'+day;
        if(mon<10) mon='0'+mon;
        let date = year+'-'+mon+'-'+day;

        let updatedComment = {
            date
        };

        if(nuevoAutor){
            updatedComment.autor = nuevoAutor;
        }

        if(nuevoContenido){
            updatedComment.contenido = nuevoContenido;
        }

        if(nuevoTitulo){
            updatedComment.titulo = nuevoTitulo;
        }

        CommentList.updateComment(urlId, updatedComment)
            .then( result => {
                console.log(result);
                if (result){
                    return res.status(202).json(result);

                }
                else{
                    res.statusMessage = "Comentario con ese id no encontrado";
                    return res.status(404).send();

                }
            })
            .catch( error => {
                return Error( error );
            });

    } 
 });
 

 let server;

 function runServer(port, databaseUrl) {
     return new Promise((resolve, reject) => {
         mongoose.connect(databaseUrl, response => {
             // Si hay un response del mongoose.connect
             // significa que fallo algo
             if (response) {
                 return reject(response);
             } else {
                 server = app.listen(port, () => {
                         console.log("App is running on port " + port);
                         resolve();
                     })
                     .on('error', err => {
                         mongoose.disconnect();
                         return reject(err);
                     })
             }
         });
     });
 }
 
 function closeServer() {
     return mongoose.disconnect()
         .then(() => {
             return new Promise((resolve, reject) => {
                 console.log('Closing the server');
                 server.close(err => {
                     if (err) {
                         return reject(err);
                     } else {
                         resolve();
                     }
                 });
             });
         });
 }
 
 runServer( PORT, DATABASE_URL );
 
 module.exports = { app, runServer, closeServer}