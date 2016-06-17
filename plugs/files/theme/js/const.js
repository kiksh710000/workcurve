"use strict";
const // CONST NUMBER
	WORK_TIME = 8, 
	HOUR_TIME = 60 * 60, 
	HOUR_MILL_TIME = 60 * 60 * 1000,
	WORK_FULL_TIME = 8 * HOUR_TIME,
	WORK_MILL_TIME = WORK_TIME * HOUR_MILL_TIME, SUCCESS = 200, 
	SUCCESS_READY_STATE = 4,
	
	// MONTH
	MONTH = 1,
	
	//AJAX TYPE
	POST = "POST", 
	GET = "GET",
	
	// ELEMENT CLASS
	GO_TO_MONTH_CLASS_TYPE = "table.TextCalendar td a",
	GO_TO_MONTH_WORK_TIME_CLASS_TYPE="td.TextCalendar a",
	WORK_TIME_CLASS=".Text0",
	
	// ELEMENT ID
	EVENT_TARGET = "#__EVENTTARGET",
	EVENT_ARGUMENT = "#__EVENTARGUMENT",
	
	//REGX
	REGX_LEFT='(',
	REGX_RIGHT=')',
	REGX_EXPRESSION=/\W{3}/g,
	
	//URL
	URL = "http://gold/attendance/attendance.aspx",
	CONTENT_TYPE="Content-Type",
	CONTENT_TYPE_HEADER="application/x-www-form-urlencoded",
	// STRING
	NULL = "";