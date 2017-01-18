import store from '../system/store.js';

const kitemServiceFactory = function kitemServiceFactory(){


    const kitemService =  {

        getListItems(listId){
            if(typeof listId !== 'string' || !listId.length){
                return Promise.reject(new TypeError('Please give a klist id'));
            }
            return new Promise( (resolve, reject) => {
                store.view('kboard', 'klistitems', { key : listId }, (err, data) => {
                    if(err){
                        return reject(err);
                    }
                    return resolve(data);
                });
            });
        },

        add(item){

        }
    };

    return kitemService;
};

export default kitemServiceFactory;
