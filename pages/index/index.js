//index.js

//get current date
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const dayInMonth = date.getDate();
const dayInWeek = date.getDay();

//week for display
const week = [
  { 'value': '周日', 'class': 'weekend' },
  { 'value': '周一', 'class': '' },
  { 'value': '周二', 'class': '' },
  { 'value': '周三', 'class': '' },
  { 'value': '周四', 'class': '' },
  { 'value': '周五', 'class': '' },
  { 'value': '周六', 'class': 'weekend' },
];

//selected date
let selected = [year, month, dayInMonth];

//some functions
let isLeapYear = function(y){
  return y % 400 == 0 || (y % 4 == 0 && y % 100 != 0);
}

let isToday = function(y, m, d){
  return y == year && m == month && d == dayInMonth;
}

let isWeekend = function(emptyGrids, d){
  return (emptyGrids + d) % 7 == 0 || (emptyGrids + d - 1) % 7 == 0
}

//calculate the empty grids for each month
let calEmptyGrid = function(y, m){
  return new Date(`${y}/${m}/01 00:00:00`).getUTCDay();
}

//calculate the days in the given month
let calDaysInMonth = function(y, m){
  let leapYear = isLeapYear(y);
  if (month == 2 && leapYear){
    return 29;
  }
  if (month == 2 && !leapYear){
    return 28;
  }
  if([4,6,9,11].includes(m)){
    return 30;
  }
  return 31;
}

let calWeekDay = function(y, m ,d) {
  return new Date(`${y}/${m}/${d} 00:00:00`).getUTCDay();
}

//return the display array
let calDays = function(y, m) {
  let emptyGrids = calEmptyGrid(y, m);
  let daysInMonth = calDaysInMonth(y, m);
  let days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    let ifToday = isToday(y, m ,i); 
    let isSelected = selected[0] == y && selected[1] == m && selected[2] == i;
    let today = ifToday ? 'today' : '';
    let select = isSelected ? 'selected' : '';
    let weekend = isWeekend(emptyGrids, i) ? 'weekend' : '';
    let todaySelected = ifToday && isSelected ? 'today-selected' : '';
    let day = {
      'value': i,
      'class': `date-bg ${weekend} ${today} ${select} ${todaySelected}`,
    }
    days.push(day);
  }
  return days;
}

Page({
  data: {
    currYear: year,
    currMonth: month,
    currDayInWeek: week[dayInWeek].value, 
    week: week,
    emptyGridsPre: calEmptyGrid(year, month),
    days: calDays(year, month),
    current: 1,
    displayDate: [
      {
        'year': year,
        'month': month - 1,
        'emptyGrids': calEmptyGrid(year, month - 1),
        'days': calDays(year, month - 1)
      },
      {
        'year': year,
        'month': month,
        'emptyGrids': calEmptyGrid(year, month),
        'days': calDays(year, month)
      },
      {
        'year': year,
        'month': month + 1,
        'emptyGrids': calEmptyGrid(year, month + 1),
        'days': calDays(year, month + 1)
      }
    ],
    selected: selected
  },
  
  changeMonth: function (e){
    let id = e.target.id;
    let currYear = this.data.currYear;
    let currMonth = this.data.currMonth;
    currMonth = id == 'prev' ? currMonth - 1 : currMonth + 1;
    if(id == 'prev' && currMonth < 1){
      currYear -= 1;
      currMonth = 12;
    }
    if(id == 'next' && currMonth > 12){
      currYear += 1;
      currMonth = 1;
    }
    this.setData({
      currYear: currYear,
      currMonth: currMonth,
      emptyGrids: calEmptyGrid(currYear, currMonth),
      days: calDays(currYear, currMonth)
    });
  },

  swipeMonth: function(e){
    let current = e.detail.current;
    let origin = this.data.current;
    let currYear = this.data.currYear;
    let currMonth = this.data.currMonth;
    console.log(current, origin);
    if(current < origin){
      currMonth -= 1;
      if(currMonth < 1){
        currYear -= 1;
        currMonth = 12;
      }
    }else{
      currMonth += 1;
      if(currMonth > 12){
        currYear += 1;
        currMonth = 1;
      }
    }
    console.log(currYear, currMonth);
    this.setData({
      currYear: currYear,
      currMonth: currMonth,
      emptyGrids: calEmptyGrid(currYear, currMonth),
      days: calDays(currYear, currMonth),
      displayDate: [
        {
          'year': currYear,
          'month': currMonth,
          'emptyGrids': calEmptyGrid(currYear, currMonth - 1),
          'days': calDays(currYear, currMonth - 1)
        },
        {
          'year': currYear,
          'month': currMonth,
          'emptyGrids': calEmptyGrid(currYear, currMonth),
          'days': calDays(currYear, currMonth)
        },
        {
          'year': currYear,
          'month': currMonth,
          'emptyGrids': calEmptyGrid(currYear, currMonth + 1),
          'days': calDays(currYear, currMonth + 1)
        }
      ],
    });
  },

  selectDate: function (e){
    let data = e.target.dataset.selected;
    selected = [data[0], data[1], data[2]];
    let dayInWeek = calWeekDay(data[0], data[1], data[2]);
    let days = calDays(data[0], data[1]);
    console.log(week);
    console.log(dayInWeek);
    this.setData({
      currYear: data[0],
      currMonth: data[1],
      currDayInWeek: week[dayInWeek].value,
      days: days,
      displayDate: [
        {
          'year': data[0],
          'month': data[1] - 1,
          'emptyGrids': calEmptyGrid(data[0], data[1] - 1),
          'days': calDays(data[0], data[1] - 1)
        },
        {
          'year': data[0],
          'month': data[1],
          'emptyGrids': calEmptyGrid(data[0], data[1]),
          'days': calDays(data[0], data[1])
        },
        {
          'year': data[0],
          'month': data[1] + 1,
          'emptyGrids': calEmptyGrid(data[0], data[1] + 1),
          'days': calDays(data[0], data[1] + 1)
        }
      ],
      selected: selected
    })
  }
})
