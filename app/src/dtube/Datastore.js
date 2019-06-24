'use strict'

var hasLocalStorage = function () {
    try {
        window.localStorage.setItem('persistVolume', 'persistVolume');
        window.localStorage.removeItem('persistVolume');
        return true;
    } catch (e) {
        return false;
    }
}

class datastore {
    constructor(self) { this.self = self }

    getItem = function (key) {
        return new Promise((resolve, reject) => {
            if (hasLocalStorage()) {
                var obj = JSON.parse(window.localStorage.getItem(key));
                resolve(obj)
            } else {
                self.ipfs._repo.datastore.get(key, (err, value) => {
                    if (err) reject(err)
                    var obj = JSON.parse(value);
                    resolve(obj)
                })
            }
        });
    }

    setItem = function (key, value) {
        return new Promise((resolve, reject) => {
            //if(typeof cb !== "function") throw "cb is not a function";
            hasLocalStorage() ? window.localStorage.setItem(key, JSON.stringify(value)) :
                self.ipfs._repo.datastore.set(key, JSON.stringify(value), (err, value) => {
                    if(err) reject(err);
                    resolve("sucess")
                });
        });

    }
}

exports = module.exports = datastore;