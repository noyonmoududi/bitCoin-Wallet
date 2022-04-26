const BaseModel = loadCore('model');
let CryptoBalance = loadService('cryptoBalance');
let cryptoBalance = new CryptoBalance();

let cryptoConfig = loadConfig('cryptoConfig');
let allowedCurrencies = cryptoConfig.allowedCurrencies;

module.exports = class UserAddressModel extends BaseModel {
    constructor(){
        super();
        this.table = 'user_addresses';
    }

    findByWallets(id,Req,Res,){
        let _this = this;
        return new Promise((resolve,reject)=>{
            let objRes = {
                error:0,
                status:'success',
                data :{}
            };
            _this.db(_this.table).where({user_id: id}).select().then(res=>{
                if (res){
                    objRes.data = res;
                    resolve(objRes.data);
                }else{
                    Req.flash('fail', 'Data not Found!');
                    objRes.error = 1;
                    objRes.status = 'fail';
                    objRes.data = {message:'Data not Found!'};
                    reject(objRes)
                }
            }).catch(err=>{
                console.log(err);
                return reject(err)
            })
        })


    }

    findAddress(id,currency,Req,Res,){
        let _this = this;
        return new Promise((resolve,reject)=>{
            let objRes = {
                error:0,
                status:'success',
                data :{}
            };
            _this.db(_this.table).where({user_id: id,currency:currency}).select().then(res=>{
                if (res){
                    objRes.data = res;
                    resolve(objRes.data);
                }else{
                    Req.flash('fail', 'Data not Found!');
                    objRes.error = 1;
                    objRes.status = 'fail';
                    objRes.data = {message:'Data not Found!'};
                    reject(objRes)
                }
            }).catch(err=>{
                console.log(err);
                return reject(err)
            })
        })


    }

    save(saveObj,Req,Res,){
        let _this = this;
        return new Promise((resolve,reject)=>{
            let objRes = {
                error:0,
                status:'success',
            };
            _this.db(_this.table).insert(saveObj).then(res=>{
                if (res){
                    resolve(objRes);
                }else{
                    Req.flash('fail', 'Data not Saved!');
                    objRes.error = 1;
                    objRes.status = 'fail';
                    objRes.data = {message:'Data not Saved!'};
                    reject(objRes)
                }
            }).catch(err=>{
                console.log(err);
                return reject(err)
            })
        })


    }
    findOneByWalletAndUser(walletId,userId,Req,Res,){
        let _this = this;
        return new Promise((resolve,reject)=>{
            let objRes = {
                error:0,
                status:'success',
                data :{}
            };
            _this.db(_this.table).where({user_id: userId,id:walletId}).first().then(res=>{
                if (res){
                    objRes.data = res;
                    resolve(objRes.data);
                }else{
                    Req.flash('fail', 'Data not Found!');
                    objRes.error = 1;
                    objRes.status = 'fail';
                    objRes.data = {message:'Data not Found!'};
                    reject(objRes)
                }
            }).catch(err=>{
                console.log(err);
                return reject(err)
            })
        })


    }

    async getUserAddress(user_id, currency, address) {
        try {

            if (!allowedCurrencies.includes(currency)) {
                return Promise.reject({error: 1, message: siteContents['currency_not_allow']})
            }
            // const data = await this.db.from(this.table).where({user_id:user_id,status:1,currency:currency}).orderBy('created_at').first();
            const data = await this.db.from(this.table).where({
                user_id: user_id,
                currency: currency,
                address: address
            }).orderBy('created_at').first();
            if (data) {
                let balance = await cryptoBalance.getBalance((data.currency || 'BTC').toUpperCase(), data.address);
                if (currency.toUpperCase() === "ETH") {
                    balance.balance = Number(balance.balance) / (1000000000000000000);
                }
                data.unconfirmedBalance = balance.unconfirmedBalance;
                data.balance = balance.balance;
                data.total = balance.total;
                return data;
            }

        } catch (e) {
            return Promise.reject(e);
        }

    }
}