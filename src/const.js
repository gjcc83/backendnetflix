module.exports = {

    SECRET_KEY : process.env.SECRET_KEY || "@[=g3,8d]\\&fbb=-q]/hk%fg",
    SECRET_KEY_STRIPE : process.env.SECRET_KEY_STRIPE || "sk_test_pYxjoqwyHCxAuTBSg5KmQFCK",
    SUBSCRIPTIONS_TYPES : {
        "GOLD" : "plan_E1YUvsfi7o3SWM",
        "PREMIUM" : "plan_E1YZBd5eoMOVCX"
    },
    MONGO_URI : "mongodb://prueba:prueba123@cluster0-shard-00-00-kcugd.mongodb.net:27017,cluster0-shard-00-01-kcugd.mongodb.net:27017,cluster0-shard-00-02-kcugd.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",
    TEST_MONGO_URI : "mongodb://prueba:prueba123@cluster0-shard-00-00-kcugd.mongodb.net:27017,cluster0-shard-00-01-kcugd.mongodb.net:27017,cluster0-shard-00-02-kcugd.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"
};
