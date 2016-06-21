"use strict";
function createWorkTime(date, am, pm) {
	return new WorkTime(date, am, pm);
}

function getTableRowValues(td) {
	var dateArr = [];
	td.each(function (index, item) {
		let date = setDateForEachColumn($(item));
		dateArr.push(date);
	});
	return dateArr;
}

function setDateForEachColumn($item) {
	let dateString = $item.text().trim();
	let date = undefined;
	if (dateString.length > 0) {
		date = new Date(dateString);
	}
	return date;
}

function initWorkTime(workTime, domValues) {
	workTime.setDate(domValues[0]);
	workTime.setAm(domValues[1]);
	workTime.setPm(domValues[2]);
	let realWorkTime = workTime.getRealWorkTime();
	let time = realWorkTime - WORK_TIME;
	workTime.setLackTime(realWorkTime > 0 ? time : 0);
}
var createWorkTimes = function($response){
	let $table = $response.find(WORK_TIME_CLASS);
	let workTimes = new Array();
	$table.each(function (index, item) {
		let $item = $(item);
		let $td = $item.find("td");
		let workTime = createWorkTime();
		let domValues = getTableRowValues($td);
		initWorkTime(workTime, domValues);
		workTimes.push(workTime);
	});
	return workTimes;
}

var getMonthWork = function($response){
	let workTimes = createWorkTimes($response);
	let month = undefined;
	if(workTimes.length > 0){
		month = workTimes[0].getDate();
	}
	return new Work(workTimes, month);
}

var isContainue = function(){
	let size = record.getAllWorks().length;
	return size >= MONTH ? false:true;
}
var completeRecord= function(){
	let works = record. getAllWorks();
	for (let workIndex in works){
		if(!works[workIndex].isComplete() && workIndex < works.length -1){
			completeWork(works, workIndex);
		}
	}
	works.pop();
}
var completeWork = function(works, workIndex){
	let currentMonth = works[workIndex];
	currentMonth.pop();
	let previousMonth = works[(new Number(workIndex)+1)];
	let previousMonthWorkTime = previousMonth.getWorkTimes().slice(WORK_END_DATE);
	currentMonth.append(previousMonthWorkTime);
	console.debug();
}
var getLastWorkTime = function(works, workIndex){
	let work = works[workIndex];
	let workTimes = work.getWorkTimes();
	let lastIndex = workTimes.length - 1;
	return workTimes[lastIndex];
}

var getRecord = function(response, classType, isSame){
	if(isContainue()){
		let $response = $(response);
		let monthWork = getMonthWork($response);
		initRecord(monthWork, $response, classType);
	} else {
		completeRecord();
		getLackWorkTimes();
		getReimburseWorkTimes();
		getOverTimeWorkTimes();
		showResult();
	}
}
var getLackWorkTimes = function(){
	record.getLackWorkTimes(function(workTime, realWorkTime, timeRule){
			let isOut = Math.floor(((new Date()- workTime.getDate()) / (HOUR_MILL_TIME *24)));
			let week = workTime.getDate().getDay();
			workTime.setLackTime(realWorkTime - timeRule);
			if(isOut <= 7  && week <= 6 /*&& realWorkTime < timeRule*/ && realWorkTime > 0){
				this.currentWeekLackWorkTimes.push(workTime);
			} 
			if(isOut > 7) {
				return true;
			}
			return false;
	}, WORK_TIME);

}
var getReimburseWorkTimes = function(){
	record.getReimburseWorkTimes(function(workTime, realWorkTime, timeRule){
		let week = workTime.getDate().getDay();
		if(realWorkTime >= timeRule && week < 6 && week > 0){
			this.reimburseWorkTimes.push(workTime);
		}
	}, WORK_REIMBURSE_TIME);	
}

var getOverTimeWorkTimes = function(){
	record.getOverTimeWorkTimes(function(workTime, realWorkTime, timeRule){
		let week = workTime.getDate().getDay();
		if(realWorkTime >= timeRule && (week == 6 || week == 0)){
			this.overTimeWorkTimes.push(workTime);
		}
	}, WORK_TIME);
}
var initRecord = function(monthWork, $response, classType){
	let has = record.has(monthWork);
	if(has){
		classType = GO_TO_MONTH_WORK_TIME_CLASS_TYPE;
		getMonthWorkTime($response, classType);
	} else {
		classType = GO_TO_MONTH_CLASS_TYPE;
		record.append(monthWork);
		getMonthWorkTime($response, classType);
	}
}

var getMonthWorkTime = function ($response, classType){
	if(undefined != $response){
		submitForm($response, classType);
	}
}

var submitForm = function($response, classType){
	let $form = getResponseForm($response);
	let $arguments = getEventArguments($form, classType);
	setArguments($form, $arguments);
	bindFormSubmit($form);
	$form.submit();
}

var bindFormSubmit = function($form){
	var option = {
			url:URL,
			type:POST,
			delegation:true,
			success:function(response){
				let $response = $(response);
				getRecord($response, GO_TO_MONTH_WORK_TIME_CLASS_TYPE);
			}
		}
	$form.submit(function(){
		$(this).ajaxSubmit(option);
		return false;
	});
}

var setArguments = function($form, $arguments){
	let $eventTarget = $form.find(EVENT_TARGET);
	let $eventArguments = $form.find(EVENT_ARGUMENT);
	$eventTarget.val($arguments[0]);
	$eventArguments.val($arguments[1]);
}

var getResponseForm = function($response){
	return $($response.get(13));
}

var getEventArguments = function($form, classType){
	let $cale = $form.find("#cale");
	let $adjacentMonth = $cale.find(classType);
	let href = undefined;
	if($adjacentMonth.length > 2){
		href = $adjacentMonth[1].href;
	} else {
		href = $adjacentMonth[0].href;
	}
	return 	getArgument(href);
}

var getArgument = function(text){
	let start = getIndex(text, REGX_LEFT);
	let end = getIndex(text, REGX_RIGHT);
	return text.substring(start+2, end-1).split(REGX_EXPRESSION);
}

var getIndex = function(text, matchString){
	return text.indexOf(matchString);
}

var showResult = function(){
	initTmpl();
}
var initTmpl = function(){
	let currentWeekLackWorkTimes = record.currentWeekLackWorkTimes,
	reimburseWorkTimes = record.reimburseWorkTimes,
	overTimeWorkTimes = record.overTimeWorkTimes;
	let $webSiteBody = $("body");
	$webSiteBody.append(template);
	currentWeekLackWorkTimes.total = getTotalLoackWorkTimes(currentWeekLackWorkTimes);
	let lackWorkTimesTmpl = $("#template").tmpl({data : currentWeekLackWorkTimes});
	let reimburseWorkTimesTmpl = $("#template").tmpl({data : reimburseWorkTimes});
	let overTimeWorkTimesTmpl = $("#template").tmpl({data : overTimeWorkTimes});
	show(lackWorkTimesTmpl);
	show(reimburseWorkTimesTmpl);
	show(overTimeWorkTimesTmpl);
	end();
}
var getTotalLoackWorkTimes = function(times){
	let time = 0;
	times.forEach(function(item){
		let workTime = item;
		time +=item.getLackTime(); 
	});
	return time;
}
var show = function(tmpl){
	$("#notification").append(tmpl);
}
var end = function(){
	let $notification = $("#notification");
	$notification.css(CSS.notification);
	let $close = $notification.find("#notificationClose");
	$close.css(CSS.close);
	let $closeLink = $notification.find(".closeLink");
	$closeLink.css(CSS.closeLink);
	let $labels = $notification.find(".label");
	$labels.css(CSS.label);
	let $clear = $notification.find(".clear");
	$clear.css(CSS.clear);
	let $columns = $notification.find(".column");
	$columns.css(CSS.column);
	let $rows = $notification.find(".row");
	$rows.css(CSS.row);
	let $totalRow = $notification.find(".totalRow");
	$totalRow.css(CSS.row);
	$totalRow.css(CSS.totalRow);

}
$("#close").click(function(){
	console.log();
});