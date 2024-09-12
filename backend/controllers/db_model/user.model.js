var service = require('../../services/service');
var mongoose = require('mongoose');   

//describe the model
var User = service.user;
var Reward = service.reward;


//common function
function userModel()
{
    this.findOneData=(table,findCondition)=>{
        return new Promise((resolve,reject)=>{
            table.findOne(findCondition,(err,result)=>{
                err ? reject(err) : resolve(result);
            })
        })
    }

    this.addData=(tableData)=>{
        return new Promise((resolve,reject)=>{
            tableData.save((err, Detail)=> {
                err ? reject(err) : resolve(Detail);
            })
        })
    }

    this.updateOneData=(table,setCondition,setData)=>{
        return new Promise((resolve,reject)=>{
            table.updateOne(setCondition,setData,(err,result)=> {
                err ? reject(err) : resolve(result);
            })   			
        })
    }

    this.findData=(table,findCondition)=>{
        return new Promise((resolve,reject)=>{
            table.find(findCondition,(err,result)=>{
                err ? reject(err) : resolve(result);
            })
        })
    }
    
    this.updateMany=(table,setCondition,setData)=>{
        return new Promise((resolve,reject)=>{
            table.updateMany(setCondition,setData,(err,result)=> {
                err ? reject(err) : resolve(result);
            })   			
        })
    }

    this.getCount=(condition)=>{
        return new Promise((resolve,reject)=>{
            Reward.aggregate([
                {
                    $match: condition
                },
                {      
                    $group: {
                        _id:null,
                        count: { $sum: '$points' },
                       
                    }
                }
            ],(err,result)=>{
                err ? reject(err) : resolve(result);
            });               
        })
    }

    this.deleteOneData=(table,findCondition)=>{
        return new Promise((resolve,reject)=>{
            table.deleteOne(findCondition,(err,result)=>{
                err ? reject(err) : resolve(result);
            });
        })
    }

    this.getRewarddata=(condition)=>{
        return new Promise((resolve,reject)=>{
            Reward.aggregate([
                  { 
                    $lookup:{
                        from: "user",
                        localField:"given_by",
                        foreignField:"_id",
                        as:'sender_data'
                    }
                },
                {
                    $unwind: '$sender_data'
                }, 
                {
                    $project: {
                        given_to:1, 
                        given_by:1,
                        points:1,  
                        created_on: 1,
                        updated_on:1,
                        sender_name:  '$sender_data.user_name',
                    }
                },
                {
                    $match: condition
                },
            ],(errData,resultData)=>{
                errData ? reject(errData) : resolve(resultData);
            })  
        })
    }
}

module.exports=new userModel()
