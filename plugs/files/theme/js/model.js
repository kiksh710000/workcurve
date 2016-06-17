"use strict";
/**
 * Work time for every day
 */
class WorkTime {
	constructor(date, am, pm) {
		this.date = date;
		this.am = am;
		this.pm = pm;
	}
	getDate() {
		return this.date;
	}
	setDate(date) {
		this.date = date;
	}
	getAm() {
		return this.am;
	}
	setAm(am) {
		this.am = am;
	}
	getPm() {
		return this.pm;
	}
	setPm(pm) {
		this.pm = pm;
	}

	getRealWorkTime() {
		var realWorkTime = 0;
		let am = this.getAm(),
		pm = this.getPm();
		if (undefined != am && undefined != pm) {
			realWorkTime = (pm - am);
		}
		return Math.floor(realWorkTime / HOUR_MILL_TIME);
	}

	toString() {
		console.table(this);
	}
	equals(workTime){
		if(	this.date != workTime.date){
			return false;
		}
		if(this.am != workTime.am){
			return false;
		}
		if(this.pm != workTime.pm){
			return false;
		}
	}
}
/**
 * Work for a month
 */
class Work {
	constructor(workTimes, month) {
		this.month = month;
		this.workTimes = workTimes;
	}
	getMonth(){
		return this.month;
	}
	setMonth(month){
		this.month = month;
	}
	getWorkTimes(){
		return this.workTimes;
	}
	setWorkTimes(workTimes){
		this.workTimes = workTimes;
	}
	getLackWorkTimes(functionName){
		this.execute(functionName);
	}
	getReimburseWorkTimes(functionName){
		this.execute(functionName);
	}
	execute(functionName){
		functionName.apply(this, this.workTimes);
	}
	equals(workTimes){
		if(this.month.toString() != workTimes.month.toString()){
			return false;
		}
		if(this.workTimes.toString() == workTimes.toString()){
			return false;
		}
		return true;
	}
}
/**
 * Record for last 4 months;
 */
class Record {
	constructor(works) {
		this.record = new Set();
		this.append(works);
	}
	getWorks(index = 0) {
		return this.record[index];
	}
	setWorks(works) {
		this.works = works;
	}
	append(works){
		if(undefined != works){
			this.record.add(works);
		}
	}
	getAllWorks(){
		return this.record;
	}
	has(workTime){
		let isEquals = false;
		this.record.forEach(function(work){
			isEquals = work.equals(workTime);
		});
		return isEquals;
	}
}

