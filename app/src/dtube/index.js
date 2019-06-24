const ipfs = require('ipfs')
const datastore = require('./Datastore')
const uploader = require('./uploader')
const videoControls = require('./videoControls')
const ImageProxy = require('./ImageProxy')
//import ipfs from 'ipfs';
//import ipfsClient from 'ipfs-http-client'



//Starts ipfs in recommended environment.
function startIpfs(config) {
    var defaults = {

    };
    if(config) config=defaults;

    return new ipfs(config);
}

class dtube {
    
    constructor(config) {
        
        console.log(typeof config)
        if(typeof config !== "object") throw "Invalid argument"
        if(config.ipfs !== undefined) {
            this.ipfs = config.ipfs;
        }
        if(config.clientMultiaddr === undefined) {
            if(config.ipfsconfig !== undefined) {
                this.ipfs = startIpfs(config.ipfsconfig)
            } else {
                this.ipfs = new ipfs();
            }
        }
        
        this.datastore = new datastore(this);
        this.uploader = new uploader(this);
        this.videoControls = new videoControls(this);
        this.ImageProxy = new ImageProxy(this);
    }

    getVideo(request, cb) {
        
        if(request.permlink !== undefined) {
            //Grab steem data
            
        }

    }
}
exports = module.exports = dtube;
//export default dtube;