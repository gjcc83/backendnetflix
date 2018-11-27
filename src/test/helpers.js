const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

process.env.NODE_ENV = "test";

const config = {
    db: {
        test : "mongodb://gjcc:As123456@ds047632.mlab.com:47632/prueba"
    },
    connection : null
};

function connect() {

    return new Promise((resolve, reject) => {
        if (config.connection) {
            return resolve();
        }

        const mongoUri = "mongodb://gjcc:As123456@ds047632.mlab.com:47632/prueba";

        mongoose.Promise = Promise;

        const options = {
            server : {
                auto_connect : true,
                reconnectTries: Number.MAX_VALUE,
                reconnectInterval: 1000
            }
        };

        mongoose.connect(mongoUri, options);

        config.connection = mongoose.connection;

        config.connection.once('open', resolve)
                         .on('error', (e) => {
                             if (e.message.code === 'ETIMEOUT') {
                                 console.log(e);
                                 mongoose.connect(mongoUri, options);
                             }
                             console.log(e);
                             reject(e);                     
                         });
    });
}

function clearDatabase() {

    return new Promise((resolve) => {
        var count = 0;

        var collections = mongoose.connection.collections;

        var max = Object.keys(collections).length;        

        for(const i in collections) {
            collections[i].remove(function () {
                count++;
                if (count >= max) {
                    resolve();
                }
            });
        }
    });
}

module.exports = async function setupTest() {
    await connect();
    await clearDatabase();
}
