const express = require("express");
const path = require('path'); 
const mongoose = require('mongoose');   
const log = require('log-to-file');
const helpers = require("../../helpers/helpers");

const userModel = require("../db_model/user.model");
const service = require('../../services/service');
const error = require("../../util/error.json");
const { json } = require("express");

const router = express.Router(); 
const User = service.user;
const Reward = service.reward;

var appDir = path.dirname(require.main.filename);

module.exports = router;

/* this method used for crete an user */
router.post('/create_user', (req, res) => {	
	const name = req.body.userName ? req.body.userName : "";
	if(name == "") {
		return res.send({ status: 400, msg: error.User_name_is_required,data:[] }) 
	} else {
		var findCondition = {user_name:name}
		var table_name = User;
		userModel.findOneData(table_name,findCondition).then((userData)=>{
            if(userData){
                return	res.send({ status: 400, msg: error.User_already_created,data:[] });
            } else {
                const userDatail = User({
					user_name: name,
					created_on:new Date(),
					updated_on:new Date()
				});
				userModel.addData(userDatail).then((userSave)=>{
					return res.send({ status: 200, msg: error.User_register_successfully,data:userSave });
				}).catch((err)=>{	
					log('api_create_userSave_'+err,appDir+'/logs/'+helpers.current_date(4)+'_error_log.log'); //if error occur then find in logs folder by date 
					res.send({ status: 500, msg:error.internale_server_error ,data:[] })
				})
            }
		}).catch((err)=>{	
			log('api_create_userData_'+err,appDir+'/logs/'+helpers.current_date(4)+'_error_log.log'); //if error occur then find in logs folder by date 
			res.send({ status: 500, msg:error.internale_server_error ,data:[] })
		})
	}
})

router.post('/update_user', (req, res) => {
	const userId = req.body.user_id ? req.body.user_id : "";
	var name = req.body.name ? req.body.name.trim() : "";
	if(userId == "") {
 		return res.send({ status: 400, msg: error.user_id_is_Required,data:[] }) 
    }else{
		Condition = {_id:mongoose.Types.ObjectId(userId)}
		table_name = User
		userModel.findOneData(table_name,Condition).then((userData)=>{
			if(!userData){
				return	res.send({ status: 400, msg:error.User_not_found,data:[] });
			}
			if(name==""){
				name=userData.name
			}
			const setUserData = {
				name: name,
				updated_on:new Date(),
			};

			userModel.updateOneData(table_name,Condition,setUserData).then((userUpdate)=>{
				return	res.send({ status: 200, msg: error.User_updated_successfully,data:[]});
			}).catch((err)=>{	
				log('api_update_user_userUpdate_'+err,appDir+'/logs/'+helpers.current_date(4)+'_error_log.log'); //if error occur then find in logs folder by date 
				res.send({ status: 500, msg:error.internale_server_error ,data:[] })
			})
		}).catch((err)=>{	
			log('api_update_user_userData_'+err,appDir+'/logs/'+helpers.current_date(4)+'_error_log.log'); //if error occur then find in logs folder by date 
			res.send({ status: 500, msg:error.internale_server_error ,data:[] })
		})
	}
})

router.get('/get_all_users', (req, res) => {
	const table_name = User;
	userModel.findData(table_name,{}).then((userData)=>{
        return res.send({ status: 200, msg: error.success, data:userData });
	}).catch((err)=>{	
		log('api_get_all_users_userData_'+err,appDir+'/logs/'+helpers.current_date(4)+'_error_log.log'); //if error occur then find in logs folder by date 
		res.send({ status: 500, msg:error.internale_server_error ,data:[] })
	})
})

router.post('/send_point', (req, res) => {	
	const {points, givenBy, givenTo} =  req.body
	if(points == "") {
		return res.send({ status: 400, msg: error.Point_is_required,data:[] }) 
	} else if(givenBy == "") {
		return res.send({ status: 400, msg: error.Point_givenBy_is_required,data:[] }) 
	} else if(givenTo == "") {
		return res.send({ status: 400, msg: error.Point_givenTo_is_required,data:[] }) 
	} else if(points > 100) {
		return res.send({ status: 400, msg: error.Point_is_less_then_100,data:[] }) 
	} else {
        var findCondition = {given_by: mongoose.Types.ObjectId(givenBy)}
        var table_name = Reward;
        userModel.getCount(findCondition).then((rewardData)=>{
            let pointGiven = rewardData
            if(pointGiven > 0){
               let balancePoint =  100 - pointGiven
               if(points > balancePoint){
                return res.send({ status: 400, msg: "insuffcient balance",data:[] }) 
               }
            }
            const rewardDatail = Reward({
                points: points,
                given_by: mongoose.Types.ObjectId(givenBy),
                given_to: mongoose.Types.ObjectId(givenTo),
                created_on:new Date(),
                updated_on:new Date()
            });
            userModel.addData(rewardDatail).then((rewardSave)=>{
                return res.send({ status: 200, msg: error.User_register_successfully,data:rewardSave });
            }).catch((err)=>{	
                log('api_send_point_rewardSave_'+err,appDir+'/logs/'+helpers.current_date(4)+'_error_log.log'); //if error occur then find in logs folder by date 
                res.send({ status: 500, msg:error.internale_server_error ,data:[] })
            })
        }).catch((err)=>{	
            log('api_send_point_getCount_'+err,appDir+'/logs/'+helpers.current_date(4)+'_error_log.log'); //if error occur then find in logs folder by date 
            res.send({ status: 500, msg:error.internale_server_error ,data:[] })
        })
	}
})

router.get('/show_p5_balence/:id', (req, res) => {	
	const user_id =  req.params.id
    var findCondition = {given_by: mongoose.Types.ObjectId(user_id)}
    var table_name = Reward;
    userModel.getCount(findCondition).then((rewardData)=>{
        let countdata = 100 - rewardData[0].count
        return res.send({ status: 200, msg: "p5 balance",data:countdata });
    }).catch((err)=>{	
        log('api_get_p5_point_getCount_'+err,appDir+'/logs/'+helpers.current_date(4)+'_error_log.log'); //if error occur then find in logs folder by date 
        res.send({ status: 500, msg:error.internale_server_error ,data:[] })
    })
})

router.get('/delete_p5_point/:id', (req, res) => {
	const user_id =  req.params.id
	if(user_id == "") {
 		return res.send({ status: 201, msg: "transaction id is Required",data:[] }) 
    }else{
		Condition = {_id:mongoose.Types.ObjectId(user_id)}
		table_name = Reward

		userModel.deleteOneData(table_name,Condition).then((userUpdate)=>{
			return	res.send({ status: 200, msg: "Transaction deleted",data:[]});
		}).catch((err)=>{	
			log('api_delete_p5_point_userUpdate_'+err,appDir+'/logs/'+helpers.current_date(4)+'_error_log.log'); //if error occur then find in logs folder by date 
			res.send({ status: 500, msg:error.internale_server_error ,data:[] })
		})
	}
})

router.get('/get_rewards/:id', (req, res) => {
    const user_id =  req.params.id
	if(user_id == "") {
 		return res.send({ status: 201, msg: "transaction id is Required",data:[] }) 
    }else{
        const table_name = Reward;
        var findCondition = {given_to: mongoose.Types.ObjectId(user_id)}
        userModel.getRewarddata(findCondition).then((userData)=>{
            return res.send({ status: 200, msg: error.success, data:userData });
        }).catch((err)=>{	
            log('api_get_rewards_userData_'+err,appDir+'/logs/'+helpers.current_date(4)+'_error_log.log'); //if error occur then find in logs folder by date 
            res.send({ status: 500, msg:error.internale_server_error ,data:[] })
        })
    }
	
})
