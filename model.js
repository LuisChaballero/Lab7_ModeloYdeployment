let mongoose = require( 'mongoose');

mongoose.Promise = global.Promise;

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
    fecha: {
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
                throw Error ( error );
            });
    },

    getByAutor : function( aut ){
        return Comment.find( {autor: aut })
            .then( comment => {
                return comment;
            })
            .catch ( error => {
                throw Error ( error );
            });
    },

    createComment : function ( commentInfo ){
        return Comment.create( commentInfo )
            .then ( comment => {
                return comment;
            })
            .catch ( error => {
                throw Error ( error );
            });
    },

    updateComment : function (ident, newData){
        return Comment.findOneAndUpdate( {id: ident}, newData )
            .then( result => {
                return result;
            })
            .catch( error => {
                throw Error ( error );
            })
    },
    deleteComment : function (ident) {
        return Comment.remove({id: ident})
            .then( result => {
                return result;
            })
            .catch ( error => {
                return Error (error);
            });
    }

}

module.exports = {
    CommentList
};