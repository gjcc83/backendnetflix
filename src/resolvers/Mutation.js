const Users = require('../schemas/Users');
const Movies = require('../schemas/Movies');
const Subscriptions = require('../schemas/Subscriptions');

const createToken = require('../utils/createToken');
const comparePasswords = require('../utils/comparePasswords');

const upgradeSub = require('../utils/upgradeSubscription');

const {SECRET_KEY_STRIPE} = require('../const');
const stripe = require('stripe')(SECRET_KEY_STRIPE);

function signup(_, args, context, info) {

    return Users.create(args.data).then((user) => {
        
        let token = createToken(user);
        return { token:token };

    }).catch((err) => {
        throw new Error(err);
    });
}

function login(_, args, context, info) {
    return comparePasswords(args.email, args.password)
        .then((token) => { return { token }; })
        .catch((err) => { throw err; });
}

function createMovie(_, args, context, info) {

    if (!context.user) {
        throw new Error("Authentication required");
    }

    return Movies.create(args.data).then(function(movie) {
        return movie.toObject();
    }).catch(function(err) {
        throw err;
    });

}

function updateMovie(_, args, context, info) {

    if (!context.user) {
        throw new Error("Authentication required");
    }

    return Movies.findByIdAndUpdate(args.id, { $set : args.data }, { new : true } )
    .then(function(movie) {
        return movie.toObject();
    }).catch(function(err) {
        throw err;
    });

}

function deleteMovie(_, args, context, info) {

    if (!context.user) {
        throw new Error("Authentication required");
    }

    return Movies.findOneAndUpdate( { _id: args.id }, { $set : {is_active:false} }).then(function(){
        return "Movie deleted";
    }).catch(function(err){
        throw err;
    });

}

function upgradeSubscription(_, args, context, info) {

    if (!context.user) {
        throw new Error("Authentication required");
    }

    const {subscription_id, user_payment} = context.user;
    
    return Subscriptions.findById(subscription_id).then(function(subscription) {
        if (subscription.type_subscription === args.type) {
            throw new Error("You can not upgrade the same subscription");
        }
        upgradeSub(subscription, user_payment, args.type);
        return "Subscription upgrated";
    }).catch((err) => {
        throw err;
    });
}

function addSource(_, args, context, info) {

    if (!context.user) {
        throw new Error("Authentication required");
    }

    const {user_payment} = context.user;

    stripe.customers.createSource(user_payment, {
        source : args.source
    }, function(err, customer) {
        if (err) {
            throw err;
        }        
    });
    return "Source added successfully";
}

module.exports = {
    signup,
    login,
    createMovie,
    updateMovie,
    deleteMovie,
    upgradeSubscription,
    addSource
}
