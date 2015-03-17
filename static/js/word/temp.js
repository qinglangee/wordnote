require.config({
    paths: {
        "moment": "../single_lib/moment",
        "jquery": "../jquery/jquery-2.1.0.min"
    }
});
require(['jquery', 'moment'],function($, moment){
	function getText(){
		var url = "/temp/view";
		$.get(url,{},function(o){
			if(o.status===1){
				$("#note_content").val(o.content);
				calculate();
			}
		},"json");
	}
	function submitText(){
		var content = $("#note_content").val();
		var url = "/temp/save";
		$("#result").val("");
		$("#result").removeClass("error_res");
		$.post(url,{content:content},function(o){
			if(o.status===1){
				$("#result").val("提交成功--" + new Date());
			}else{
				$("#result").addClass("error_res");
				$("#result").val(o.msg + "--" + new Date());
			}
		},"json");
	}
	
	var reviewTime = [1,2,4,7,15,25];
	var resultMap = {};
	function calculate(){ // 计算结果, 存在resultMap中
		resultMap = {};
		var records = getRecords();
		for(var i=0; i< records.length;i++){
			var r = records[i];
			for(var j=0;j<reviewTime.length;j++){
				var startDate = moment(r.time);
				var reviewDay = startDate.add(reviewTime[j], "d").format('YYYY-MM-DD');
				var reviewList = resultMap[reviewDay]; 
				if(reviewList == null){
					reviewList = [];
					reviewList[0] = r;
					resultMap[reviewDay] = reviewList;
				}else{
					var num = reviewList.length;
					var added = false;
					for(k = 0;k<num;k++){
						if(r.name < reviewList[k].name){
							reviewList.splice(k,0,r);
							added = true;
						}
					}
					if(!added){
						reviewList[num] = r;
					}
				}
			}
		}
		printResult(records);
	}
	function getRecords(){ // 原始文本转换成对象
		var content = $("#note_content").val();
		var lines = content.split('\n');
		var result = [];
		$.each(lines, function(index, line){
			var strs = $.trim(line).split('|');
			if(strs.length < 2){
				return;
			}
			result[result.length] = {"name":strs[1], "time":strs[0]};
		});
		return result;
	}
	function printResult(records){ // 打印结果
		var currDay = moment(records[0].time);
		var lastDay = moment(records[records.length-1].time).add(25, "d");
		var result = "";
		var showOld = $("#showOld").prop("checked");
		while(currDay.diff(lastDay, 'days') < 2){
			if(!showOld && (currDay.diff(moment(), 'days') < 0)){
				currDay.add(1, "d");
				continue;
			}
			var day = currDay.format('YYYY-MM-DD');
			result += day;
			var reviews = resultMap[day];
			for(rec in reviews){
				result += "   " + reviews[rec].name;
			}
			if(reviews != null && reviews.length > 0){
			}
			result += '\n';
			if(currDay.diff(currDay.clone().startOf('week')) === 0){  // 一周的开始是周日
				result += '\n';
			}
			currDay.add(1, "d");
		}
		$("#result").val(result);
	}
	getText();
	$("#flush_btn").on('click', getText);
	$("#submit_btn").on('click', submitText);
	$("#calculate").on('click', calculate);
});
