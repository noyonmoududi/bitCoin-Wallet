const BaseModel = loadCore('model');

module.exports = class currencyModel extends BaseModel {
    constructor(){
        super();
        this.table = 'currencies';
    }

    getAllData(Req,Res){
        let _this = this;
        return new Promise((resolve,reject)=>{
            let empRes = {
                error:0,
                status:'success',
                data :{}
            };
            _this.db(_this.table).where({status: 1}).select().then(res=>{
                if (res){
                    empRes.data = res;
                    resolve(empRes.data);
                }else{
                    Req.flash('fail', 'Data not Found!');
                    empRes.error = 1;
                    empRes.status = 'fail';
                    empRes.data = {message:'Data not Found!'};
                    reject(empRes)
                }
            }).catch(err=>{
                console.log(err);
                return reject(err)
            })
        })


    }
}