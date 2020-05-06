//-------------------获取时间---年月日-----------------------//
export function getDate() {
  let date = new Date();
  let y = date.getFullYear();
  let data = [];
  let year = null;
  let month = null;
  let maxY = y + 10;
  let minY = 1949;
  for (let i = minY; i <= maxY; i++) {
    year = new Object();
    year[i] = [];
    for (let j = 1; j <= 12; j++) {
      month = new Object();
      month[j] = [];
      let monthDay = currentMonth(j, i);
      for (let k = 1; k <= monthDay; k++) {
        month[j].push(k);
      }
      year[i].push(month);
    }
    data.push(year);
  }
  return data;
}
//计算当月天数
function currentMonth(m, y) {
  var monthDay = 0;
  switch (m) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      monthDay = 31;
      break;
    case 4:
    case 6:
    case 9:
    case 11:
      monthDay = 30;
      break;
    case 2:
      if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
        monthDay = 29;
      } else {
        monthDay = 28;
      }
  }
  return monthDay;
}

//-------------------获取地区---省市区-----------------------//
export function getArea() {
  let jsonData = require('./area.json'); //全国省市区json文件
  let data = [];
  for (let i in jsonData) {
    let obj = new Object();
    let newArr = [];
    let arr = jsonData[i][0];
    for (let k in arr) {
      let item = {
        [k]: arr[k],
      };
      newArr.push(item);
    }
    obj[i] = newArr;
    data.push(obj);
  }
  return data;
}
