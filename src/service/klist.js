import store from '../system/store.js';

const prefix = 'klist';

const klistServiceFactory = function klistServiceFactory(){


    const klistService =  {

        getOne(name){
            if(typeof name !== 'string' || !name.length){
                return Promise.reject(new TypeError('Please give an id to retrieve a klist'));
            }
            return new Promise( (resolve, reject) => {
                store.get( `${prefix}:${name}` , (err, data) => {
                    if(err){
                        return reject(err);
                    }
                    return resolve(data);
                });
            });
        },

        add(name, items = []){
            if(typeof name !== 'string' || !name.length){
                return Promise.reject(new TypeError('Please give an id to retrieve a klist'));
            }
            return new Promise( (resolve, reject) => {
                store.insert({
                    _id   : `${prefix}:${name}`,
                    items : items
                }, (err, data) => {
                    if(err){
                        return reject(err);
                    }
                    return resolve(data);
                });
            });
        }
    };

    return klistService;
};

export default klistServiceFactory;
