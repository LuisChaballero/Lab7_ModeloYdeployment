let mongoose = require( 'mongoose');

mongoose.Promies = global.Promise;

//La definicion del esquema de la coleccion del estudiante
let commentsCollection = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    titulo: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: true
    },
    Fecha: {
        type: String,
        required: true
    }
});

let Comment = mongoose.model('comments', commentsCollection);

let CommentList = {
    getAll : function(){
        return Comment.find()
            .then ( comments => {
                return comments;
            })
            .catch ( error => {
                return Error ( error );
            });
    }
}

module.exports = {
    CommentList
};