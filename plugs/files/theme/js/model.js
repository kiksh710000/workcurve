"use strict";
/**
 * Work time for every day
 */
class WorkTime {
	constructor(date, am, pm) {
		this.date = date;
		this.am = am;
		this.pm = pm;
		this.lackTime = undefined;
		this.dateString = undefined;
	}
	getDate() {
		return this.date;
	}
	setDate(date) {
		this.date = date;
		this.setDateString(date);
	}
	
	setDateString(date){
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		if(month < 10){
			month = "0" + month;
		}
		if(day < 10){
			day = "0" + day;
		}
		this.dateString = month + "/" + day + "/" + year;
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
	getLackTime(){
		return this.lackTime;
	}
	setLackTime(lackTime){
		this.lackTime = Math.floor(lackTime * 60);
	}
	getRealWorkTime() {
		let realWorkTime = 0;
		let am = this.getAm(),
		pm = this.getPm();
		if (undefined != am && undefined != pm) {
			realWorkTime = (pm - am);
		}
		realWorkTime = realWorkTime / HOUR_MILL_TIME;
		return realWorkTime - 1;
	}

}
/**
 * Work for a month
 */
class Work {
	constructor(workTimes, month) {
		this.month = month;
		this.workTimes = workTimes;
		this.complete = false;
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
	isComplete(){
		return this.complete;
	}
	setComplete(complete){
		this.complete = complete;
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
	append(workTimes){
		let thisWorkTimes = this.workTimes;
		workTimes.reverse();
		for(let index in workTimes){
			thisWorkTimes.unshift(workTimes[index]);
		}
	}
	pop(){
		let thisWorkTimes = this.workTimes;
		this.workTimes = thisWorkTimes.slice(0, WORK_START_DATE -1);
		if(this.workTimes.length >= 25){
			this.complete = true;
		}
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
	reverse(){
		this.workTimes = this.workTimes.reverse();
		return this;
	}
}
/**
 * Record for last 4 months;
 */
class Record {
	constructor(works) {
		this.record = new Array();
		this.append(works);
		this.currentWeekLackWorkTimes = [];
		this.reimburseWorkTimes = [];
		this.overTimeWorkTimes = [];
		this.setName();
	}
	setName(){
		this.currentWeekLackWorkTimes.name = CURRENT_WEEK_LACK_WORK_TIMES;
		this.reimburseWorkTimes.name = REIMBURSE_WORK_TIMES;
		this.overTimeWorkTimes.name = OVER_TIME_WORK_TIMES;
	}
	
	getWorks(index = 0) {
		return this.record[index];
	}
	setWorks(works) {
		this.works = works;
	}
	append(works){
		if(undefined != works){
			this.record.push(works.reverse());
		}
	}
	getAllWorks(){
		return this.record;
	}
	has(workTime){
		let isEqual = false;
		this.record.forEach(function(work){
			isEqual = work.equals(workTime);
		});
		return isEqual;
	}
	getLackWorkTimes(functionName, timeRule){
		this.execute(functionName, timeRule);
	}
	
	getOverTimeWorkTimes(functionName, timeRule){
		this.execute(functionName, timeRule);
	}
	
	getReimburseWorkTimes(functionName, timeRule){
		this.execute(functionName, timeRule);
	}
	
	execute(functionName, timeRule){
		let work = this.getAllWorks();
		let isBeak = false;
		for(let indexWork in work){
			let workTimes = work[indexWork].getWorkTimes();
			if(isBeak){
				break;
			}
			for (let indexWorkTimes in workTimes){
				let workTime = workTimes[workTimes.length - indexWorkTimes - 1];
				let realWorkTime = workTime.getRealWorkTime();
				let isOut = functionName.apply(this, [workTime, realWorkTime, timeRule]);
				if(isOut){
					isBeak = true;
					break;
				}
			}
		}
	}
	
}

