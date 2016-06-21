"use strict";
var Cross = function(){};
var fn = Cross.prototype;
fn.ajax = function(type, url, data, callback){
	var xhr = new XMLHttpRequest();
	xhr.open(type, URL, true);
	xhr.onreadystatechange = function(){
		let readyState = xhr.readyState, status = xhr.status;
		if(SUCCESS_READY_STATE === readyState && SUCCESS === status){
			var response = xhr.response;
			callback.apply(this, [response]);
		}
	}
	if(POST === type){
		xhr.setRequestHeader(CONTENT_TYPE, CONTENT_TYPE_HEADER);
		xhr.send();
	} else {
		xhr.send(null);
	}
}
var cross = new Cross();
var get = GET;
var record = new Record();
var timeToGetRecord = function(){
	let show = isShow();
	if(show){
		let currentDate = new Date();
		let dayOfWeek = currentDate.getDay();
		let hour = currentDate.getHours(),
		minunte = currentDate.getMinutes();
		if(FRIDAY === dayOfWeek && AM_TIME_HOUR === hour){
			return true;
		}
		return false;
		
	} else {
		return false;
	}
	
}
var isShow = function(){
	let isNew = isNewWeek();
	let isClose = localStorage.getItem("isClose");
	if (isNew){
		//非本周
			return true;
	} else {
		//本周
		localStorage.setItem("isClose", true);
	}
	return false;
}
var isNewWeek = function(){
	let oldWeek = localStorage.getItem("isNewWeek");
	if(undefined == oldWeek || "" == oldWeek){
		localStorage.setItem("isClose", false);
		return true;
	} else {
		let oldDate = new Date(oldWeek);
		let newDate = new Date();
		let isNew = oldDate.getFullYear() == newDate.getFullYear();
		isNew = isNew && oldDate.getMonth() == newDate.getMonth();
		isNew = isNew && oldDate.getDate() == newDate.getDate();
		return !isNew;
	}
}
var isGetRecord = function(){
	let protocol = window.location.protocol;
	if(HTTP == protocol){
		return true;
	}
	return true;

}

if(timeToGetRecord() && isGetRecord()){
	cross.ajax(get, URL, NULL, function(response){
		getRecord(response, GO_TO_MONTH_CLASS_TYPE);
	});
}


