
module.exports= class DataFormat{
    
   
    userDataFormat(user){
        if(!user instanceof Object){
            throw new Error('please send a valid user object');
        }
        const userFormattedData = {...user};
              userFormattedData.marital_status = user.marital_status===0?'unmarried':'married';
              userFormattedData.status = user.status===0?'deactive':'active';
              userFormattedData.gender = user.gender===1?'male':user.gender===2?'female':'others';
              userFormattedData.role_id = user.role_id ==1?'Super Admin':user.role_id==3?'Admin':'Normal User';
              return userFormattedData;
    };

};