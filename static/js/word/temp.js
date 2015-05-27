require.config({
    paths: {
        "moment": "../single_lib/moment",
        "jquery": "../jquery/jquery-2.1.0.min"
    }
});
require(['jquery', 'moment', '../single_lib/simpleStorage'],function($, moment, storage){
    function showInfo(msg){
        $("#result").removeClass("error_res");
		$("#result").val(msg);
    }
    function showErr(msg){
        $("#result").addClass("error_res");
		$("#result").val(msg);
    }
	function getText(){
		var url = "/temp/view";
		$.get(url,{},function(o){
			if(o.status===1){
				$("#note_content").val(o.content);
				calculate();
            }else{
                showErr(o.msg);
            }
		},"json");
	}
	function submitText(){
		var content = $("#note_content").val();
		var url = "/temp/save";
		$.post(url,{content:content},function(o){
			if(o.status===1){
				showInfo("提交成功--" + new Date());
			}else{
				showErr(o.msg + "--" + new Date());
			}
		},"json");
	}

	var reviewTime = [1,2,4,7,15,25,70];
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
        var today = currDay;
		while(currDay.diff(lastDay, 'days') < 2){
			if(!showOld && (currDay.diff(moment(), 'days') < 0)){ // 判断是否显示今天之前的
				currDay.add(1, "d");
				continue;
			}
			var day = currDay.format('YYYY-MM-DD');
			result += day;

			var reviews = resultMap[day]; // 当天的复习列表
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
		$("#schedule").val(result);
	}

    // 提交一天的单词
    function postDayWord(){
        var content = $("#note_content").val();
		var url = "/temp/saveDayWords";
		$("#result").val("");
		$("#result").removeClass("error_res");
		$.post(url,{content:content},function(o){
			if(o.err===0){
				$("#result").val("DayWords" + "提交成功--" + new Date());
			}else{
				showErr("DayWords err:" + o.msg + "--" + new Date());
			}
		},"json");
    }

    var wordsToRecite = [];
    var Review = {};
    var showIndex = -1;
    var showWord;
    // 计算结果后，请求要背的所有单词
    function calculateAndGetWords(){
        wordsToRecite = [];
        Review.total = 0;
        Review.passed = 0;
        Review.rest = 0;
        Review.forgetWords = {};
        Review.forget = 0;
        showIndex = -1;
        showReview();

        var reviewDays = [];
        if($("#reviewDays").val() != ""){
            var dayStrs = $("#reviewDays").val().split("   ");

            reviewDays = [];
            for(var i=0;i<dayStrs.length;i++){
                reviewDays[i] = {"name":dayStrs[i]};
            }
        }else{
            calculate();
            var today = moment().format('YYYY-MM-DD'); // 当天的日期
            reviewDays = resultMap[today];
        }


		var url = "/temp/review_words";

        var localedDays = 0;

        // 显示单词情况
        var wordsReady = function(day, dayWords){
            localedDays++;
            concat(wordsToRecite, dayWords);
            $("#ready_days").html("ready days:" + localedDays);

            var html = $("#summary").html() + "--" + day + ":" + dayWords.length;
            Review.total += dayWords.length;
            Review.rest += dayWords.length;
            $("#summary").html(html);
            showReview();

        }

        // 查询单词
        var getDayWords = function(days){
            var dayWords = storage.get(days);
            if(dayWords != null){
                wordsReady(days, dayWords);
            }else{
                $.get(url,{"days":days},function(o){
                    if(o.err===0){
                        storage.set(days, o.content);
                        wordsReady(days, o.content);
                    }else{
                        showErr(o.msg);
                    }
                },"json");
            }
        }
        $("#summary").html(""); // 先清空内容

        for(var i=0;i<reviewDays.length; i++){
            var days = reviewDays[i].name;
            getDayWords(days);
        }


    }

    // tab 切换
    function changeTab(){
        var tabId = $(this).attr("data-for");
        $(".nav-pills>li").removeClass("active");
        $(this).parent().addClass("active");
        $(".content-tab").hide();
        $("#"+ tabId).show();
    }

    // 显示下一个
    function showNextWord(){
        if(wordsToRecite.length > 0){
            showIndex = Math.floor(Math.random() * wordsToRecite.length);
            showWord = wordsToRecite[showIndex];
            $("#wordBox").html(showWord.text);
        }else{
            $("#wordBox").html("今天单词背完了！！");
        }
        $("#pronounceBox").html("");
        $("#translateBox").html("");
    }
    // 显示释义
    function showTranslate(){
        var html = "";

        // 一个按钮多个用处
        if(wordsToRecite.length > 0){
            var pronounce = showWord.pronounce;
            for(var i = 0; i < pronounce.length;i++){
                html += pronounce[i].name + "--" + pronounce[i].text + "<br>";
            }
            $("#pronounceBox").html(html);

            html = "";
            var trans = showWord.translate;
            for(var i = 0; i < trans.length;i++){
                html += trans[i] + "<br>";
            }
            $("#translateBox").html(html);
        }else{
            for(var name in Review.forgetWords){
                html += name + '\n';
            }
            $("#forgetWordArea").val(html);
        }
    }

    // 不记得这个
    function forget(){
        if(Review.forgetWords[showWord.text] == null){
            Review.forget ++;
        }
        Review.forgetWords[showWord.text] = 1;
        console.log(Review.forgetWords);
        showReview();
    }

    // pass这个
    function pass(){
        if(wordsToRecite.length > 0 && showIndex >= 0){
            Review.passed++;
            var deletedWord = wordsToRecite.splice(showIndex,1);
    //         console.log(deletedWord[0].text);
        }
        showReview();
        showNextWord();
    }

    // 更新Review显示
    function showReview(){
        $("#totalWords").html(Review.total);
        $("#passedWords").html(Review.passed);
        $("#forgetWords").html(Review.forget);
        $("#restWords").html(wordsToRecite.length);
    }
    function concat(arr1, arr2){
        if(arr2 == null || arr2.length == 0){
            return;
        }
        for(var i=0; i<arr2.length;i++){
            arr1[arr1.length] = arr2[i];
        }
    }

    // 保存忘记的
    function saveForget(){

		var content = $("#forgetWordArea").val();
		var url = "/temp/save_forget";
		$.post(url,{content:content},function(o){
			if(o.err===0){
				showInfo("提交成功--" + new Date());
			}else{
				showErr(o.msg + "--" + new Date());
			}
		},"json");
    }

    // 显示忘记的
    function viewForget(){
        var url = "/temp/view_forget";
		$.get(url,{},function(o){
			if(o.err===0){
				$("#forgetWordArea").val(o.content);
            }else{
                showErr(o.msg);
            }
		},"json");
    }
    
    // 显示post按钮
    var lastClick = 0;
    var continueCount = 0;
    function showPostBtns(){
        var clickTime = new Date().getTime();
        if(clickTime - lastClick < 500){
            continueCount++;
        }else{
            continueCount = 0;
        }
        if(continueCount > 7){
            $("#submit_btn").show();
            $("#day_words_post").show();
        }else{
            $("#submit_btn").hide();
            $("#day_words_post").hide();
        }
        lastClick = new Date().getTime();
    }

    function keybind(e){
        var keycode = e.which;
        console.log(keycode);
        if(keycode == 37){  // 左
            showTranslate();
        }else if(keycode == 38){ // 上
            forget();
        }else if(keycode == 39){ // 右
            pass();
        }else if(keycode == 40){ // down
            showNextWord();
        }
    }
	getText();
	$("#flush_btn").on('click', getText);
	$("#submit_btn").on('click', submitText);
	$("#calculate").on('click', calculateAndGetWords);
	$("#day_words_post").on('click', postDayWord);
    $(".tab-link").on('mousemove', changeTab);
    $(".tab-link").on('click', changeTab);
    $("#nextWord").on('click', showNextWord);
    $("#showTranslate").on('click', showTranslate);
    $("#forget").on('click', forget);
    $("#pass").on('click', pass);
    $("#saveForget").on('click', saveForget);
    $("#viewForget").on('click', viewForget);
    $("body").keyup(keybind);
    $("#schedule").on('click', showPostBtns);
});
