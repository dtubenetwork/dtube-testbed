//Not sure on how to structure this whole thing yet!

class Accounts {
    constructor(self) {
        this.self = self;
        this.AccountProviders = {
            //List of account implementations
            "steem": Steem
        }
        this.accounts = [];
    }
    currentAccount() {
        //Return account info!

    }
    //Should return a list of accounts. Ability to switch is with numerical account ID.
    listAccounts() {

    }
    switchAccount() {

    }
    login(provider, username, secretkey, rememberMe) {
        if (this.AccountProviders[provider] === undefined) throw "Unsupported account provider."
        else var account = new this.AccountProviders[provider]();
        this.accounts.push(account)
        

    }
}

//Acts like an interface!
class AccountInterface {
    login(username, secretkey, rememberMe) {

    }
    logout() {

    }
    likePost(postLink, weight) {

    }
    post() {

    }
    accoutName() {

    }
}
class Steem extends AccountInterface {
    login(username, secretkey, rememberMe) {

    }
    logout() {

    }
    likePost(postLink, weight) {

    }
    post() {

    }
    accoutName() {

    }
}
exports = module.exports = Accounts;