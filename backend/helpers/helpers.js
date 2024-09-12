var request = require("request"); 
var path = require('path');
var appDir = path.dirname(require.main.filename);
var fs = require('fs');


function current_date(date_value){
    var date = new Date();
	switch(date_value){

		case 1:var return_value = date.getUTCDate(); //1 for only date like 21
				 return return_value;
				 break;
		case 2:var return_value = date.getMonth()+1; //2 for only month.but this function provide previous month digit so add 1 for current mongth like 3 march
				 return return_value;
				 break;
		case 3:var return_value = date.getFullYear(); //3 for only year like 2020
				 return return_value;
				 break;
		case 4:var return_value = date.getUTCDate()+"-"+date.getMonth()+"-"+date.getFullYear() //4 for in this form 21-6-2020 
				 return return_value;
				 break;
	}

	return return_value
}

exports.current_date=current_date;
