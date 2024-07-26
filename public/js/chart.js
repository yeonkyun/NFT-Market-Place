// chart.js
$(function () {
  /* ChartJS
   * -------
   * Data and config for chartjs
   */
  'use strict';
  if (chartData.length > 0) {
    var data = {
      labels: chartData.map(item => item.date),
      datasets: [{
        label: '거래 성공',
        data: chartData.map(item => item.success_count),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
        fill: true
      },
      {
        label: '거래 실패',
        data: chartData.map(item => item.fail_count),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1,
        fill: true
      }]
    };

    var options = {
      plugins: {
        filler: {
          propagate: true
        }
      },
      // scales: {
      //   xAxes: [{
      //     gridLines: {
      //       display: false
      //     }
      //   }],
      //   yAxes: [{
      //     gridLines: {
      //       display: false
      //     }
      //   }]
      // }
    };

    if ($("#areachart-multi").length) {
      var multiAreaCanvas = $("#areachart-multi").get(0).getContext("2d");
      var multiAreaChart = new Chart(multiAreaCanvas, {
        type: 'line',
        data: data,
        options: options
      });
    }

    // 데이터 계산 로직 추가
    function getTodayDate() {
      var today = new Date();
      var year = today.getFullYear();
      var month = today.getMonth() + 1; // 월은 0부터 시작하므로 +1 필요
      var day = today.getDate();
      return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
    }

    function calculateTransactions(data) {
      var todayDate = getTodayDate();
      var todaySuccessed = 0;
      var todayFailed = 0;
      var totalSuccessed = 0;
      var totalFailed = 0;

      data.forEach(function (transaction) {
        totalSuccessed += parseInt(transaction.success_count);
        totalFailed += parseInt(transaction.fail_count);
        if (transaction.date === todayDate) {
          todaySuccessed += parseInt(transaction.success_count);
          todayFailed += parseInt(transaction.fail_count);
        }
      });

      return {
        todaySuccessed: todaySuccessed,
        todayFailed: todayFailed,
        totalSuccessed: totalSuccessed,
        totalFailed: totalFailed
      };
    }

    var results = calculateTransactions(chartData);
    $('#today-successed').text(results.todaySuccessed);
    $('#today-failed').text(results.todayFailed);
    $('#total-successed').text(results.totalSuccessed);
    $('#total-failed').text(results.totalFailed);

  } else {
    console.error('거래 데이터를 찾을 수 없거나 비어 있습니다.');
  }

  // 페이지 로드 시 모든 .today-date 요소에 오늘 날짜를 표시
  var todayDateElements = document.querySelectorAll('.today-date');
  var todayDate = getTodayDate();
  todayDateElements.forEach(function (element) {
    element.textContent = todayDate;
  });

  // 현재 날짜를 가져오는 함수
  function getTodayDate() {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();

    // 날짜를 YYYY-MM-DD 형식으로 포맷
    var formattedDate = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
    return formattedDate;
  }

  // 페이지 로드 시 모든 .today-date 요소에 오늘 날짜를 표시
  document.addEventListener('DOMContentLoaded', function () {
    var todayDateElements = document.querySelectorAll('.today-date');
    var todayDate = getTodayDate();
    todayDateElements.forEach(function (element) {
      element.textContent = todayDate;
    });
  });
});