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
let get = GET;
var record = new Record();
cross.ajax(get, URL, NULL, function(response){
	getRecord(response, GO_TO_MONTH_CLASS_TYPE);
});
