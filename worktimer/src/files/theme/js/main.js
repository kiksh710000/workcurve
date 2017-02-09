Array.prototype.putIfNotUndefined = function(item){
	if(null != item && undefined != item){
		this.push(item);
	}
}
var Utils = {
	isWorkingDay : function(date) {
		return date.getDay() > 0 && date.getDay() < 6;
	},
	DAY : 3600 * 1000,
	isMonday : function(date) {
		return date.getDay() == 1;
	},
	
	isEmpty : function(target) {
		return this.isNull(target) || target.trim().length <= 0;
	},
	
	isNull:function(target){
		return null == target || undefined == target;
	},
	
	DATE_OPTIONS : {
		LOCALES:["en-US"],
		OPTIONS : {year:"numeric", month:"2-digit", day:"2-digit"},
	}
}

class Day {
	constructor(date, am, pm, uid) {
		this.date = new Date(date);
		this.am = new Date();
		this.pm = new Date();
		this.uid = uid;
		if (Utils.isWorkingDay(this.date)) {
			this.setAm(am);
			this.setPm(pm);
		}
	}
	setAm(am) {
		if (!Utils.isEmpty(am)) {
			this.am = new Date(am);
		} else {
			this.am = this.date;
		}
	}
	setPm(pm) {
		if (!Utils.isEmpty(pm)) {
			this.pm = new Date(pm);
		} else {
			this.pm = this.am;
		}
	}
	getDay() {
		return this.date;
	}
	isWorkingDate() {
		if (Utils.isWorkingDay(this.date)) {
			return true;
		}
		return false;
	}
	workingTime() {
		if (this.isWorkingDate) {
			var seconds = (this.pm - this.am) / Utils.DAY;
			return seconds > 1 ? seconds -1 : 0;
		}
		return 0;
	}
	clone() {
		return new Day(this.date, this.am, this.pm);
	}
}

class Week {
	constructor() {
		this.days = [];
	}
	addDays(day) {
		this.days.push(day);
	}
	getWeekTime() {
		var result = 0;
		this.days.forEach(function(elt, i, array) {
			result += elt.workingTime();
		})
		return result;
	}
	getShowTime(){
		var time = new Number(this.getWeekTime()).toFixed(2);
		var start = undefined, end = undefined;
		this.days.forEach(function(item, index, array){
			if(item.isWorkingDate() && undefined == end){
				end = item.date.toLocaleDateString(Utils.DATE_OPTIONS.LOCALES, Utils.DATE_OPTIONS.OPTIONS);
			}
			if(item.isWorkingDate() && index == array.length - 1){
				start = item.date.toLocaleDateString(Utils.DATE_OPTIONS.LOCALES, Utils.DATE_OPTIONS.OPTIONS);
			}
		});
		if(!Utils.isNull(start) && !Utils.isNull(end)){
			return new ShowTime(start, end, time);
		}
		return undefined;
	}
}
class Month {
	constructor() {
		this.weeks = [];
	}
	addWeek(week) {
		this.weeks.push(week);
	}
	getMonthTime() {
		var times = [];
		this.weeks.forEach(function(week, index, array) {
			times.putIfNotUndefined(week.getShowTime());
		})
		return times;
	}
}
class ShowTime {
	constructor(start, end, time) {
    	this.start = start;
    	this.end = end;
    	this.time = time;
    }
}

class MoldeFactory {
	constructor() {}
	createMonth() {
		return new Month();
	}
	createWeek() {
		return new Week();
	}
	createDay(date, am, pm, uid) {
		return new Day(date, am, pm, uid);
	}
}

class DataFactory {
	static getDayInstance(index, $item, factory) {
		var uid = index;
		var datas = $item.find("td");
		$item.data({
			index : index
		});
		var date = datas[0].innerHTML;
		var am = datas[1].innerHTML;
		var pm = datas[2].innerHTML;
		var day = factory.createDay(date, am, pm, uid);
		appendNewColumn($item, datas, new Number(day.workingTime()).toFixed(2), 3);
		return day;
	}
}

var factory = new MoldeFactory();
var month = factory.createMonth();

var getResources = function() {
	// add a header column
	var $header = $("#myLogList_dgLogList tr.Header0");
	var week = factory.createWeek();
	$("#myLogList_dgLogList tr.Text0").each(function(index, item) {
		var day = DataFactory.getDayInstance(index, $(item), factory);
		if (Utils.isMonday(day.getDay())) {
			week.addDays(day);
			month.addWeek(week);
			week = factory.createWeek();
		} else {
			week.addDays(day);
		}
	// dblClick($(item));
	})
}


var showTimes = function() {
	var times = month.getMonthTime();
	var $temp = scriptGnerator().tmpl({data:times});
	var $pop = $("#popup");
	if($pop.length > 0){
		$pop.remove();
	}
	$temp.appendTo("body");
}

var TABLE = {
	id : "myLogList_dgLogList",
	headerRow : "tr.Header0",
	bodyRow : "tr.Text0",
	column : "td",
	lastColumnIndex : 2,
	maxColumn : 3,
}

var appendNewHeadColumn = function($table, row, column) {
	var $row = $table.find(row);
	var $columns = $($($row.find(column)));
	appendNewColumn($row, $columns, "time(h)", 3);
}

var appendNewColumn = function($parent, $children, result, columnIndex) {
	if ($children.length > columnIndex) {
		$($children[columnIndex]).remove();
	}
	if(result <= 0){
		result = "";
	}
	var $clone = $($children[2]).clone();
	$clone.text(result);
	$parent.append($clone);
}

var doubleClick = function() {
	$("tr.Text0 td").dblclick(function(dbevent) {
		var $item = $(this);
		// add a new input in current table column
		var input = document.createElement("input");
		// insert
		$item.html(input);
		// bind event
		$(input).blur(function(item) {
			var $this = $(this);
			var val = $this.val();
			// remove input
			$this.remove();
			// reset value to user keyed
			$item.html(val);
			// repeat do work
			month = factory.createMonth();
			doProcess();
		});
	});
}


var doProcess = function(){
	appendNewHeadColumn($("#" + TABLE.id), TABLE.headerRow, TABLE.column, "time(h)");
	getResources();
	showTimes();
}

$(document).ready(function() {
	doProcess();
	// bind double click event
	doubleClick();
});

var scriptGnerator = function(){
	var script = document.createElement("script");
	script.type="text/x-jquery-tmpl";
	script.id="template";
	script.innerHTML = `<div id="popup">
            <div class="title">work time summary</div>
            <div class="headerRow">
                <div class="header">Date</div>
                <div class="header">Working Time(h)</div>
            </div>
            {{each(index, times) data}}
                <div class="bodyRow">
                    <div class="column">{{= times.start}} - {{= times.end}}</div>
                    <div class="column">{{= times.time}}</div>
                </div>
            {{/each}}
            <div class="tips" title="双击工时表格, 修改并计算你的工时. 修改不会被保存">
            Double Click work time table column, copy your previous column to the next
            . It will recalculate your work time. 
            Your change will not be persisted </div>
            </div>`;
       return $(script);
}