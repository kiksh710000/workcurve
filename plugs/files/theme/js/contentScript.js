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
	let size = record.getAllWorks().size;
	return size >= MONTH ? false:true;
}
var getRecord = function(response, classType, isSame){
	 if(!isContainue()){
		return record;
	}
	let $response = $(response);
	let monthWork = getMonthWork($response);
	initRecord(monthWork, $response, classType);
	
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