const Movies = require('../schemas/Movies');
const Users = require('../schemas/Users');

function prueba(_, args, context, info) {
    return "Esto es una prueba en GraphQL"
}

function movies(_, args, context, info) {

    if (!context.user) {
        throw new Error("Authentication required");
    }

    return Movies.find({is_active:true}).then((movies) => {
        return movies;
    }).catch((err) => {
        throw err;
    });
}

function movie(_, args, context, info) {

    if (!context.user) {
        throw new Error("Authentication required");
    }

    return Movies.findById(args.id).then(function(movie){
        return movie.toObject();
    }).catch(function(err){
        throw err;
    });

}

function me(_, args, context, info) {
    if (!context.user) {
        throw new Error('Authentication required');
    }

    return Users.findById(context.user._id)
        .populate('subscription_id').then(user => {
            return user.toObject();
        }).catch(err => {
            throw err;
        });
}

module.exports = {
    prueba,
    movies,
    movie,
    me
}
