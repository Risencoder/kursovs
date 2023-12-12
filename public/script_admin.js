document.addEventListener('DOMContentLoaded', function() {
  // Функція для отримання прогнозу
  window.Prognoz = function() {
      // Отримати дані з форми або з іншого місця
      const type_wagon = document.getElementById("type_wagon").value;
      const route_ID = document.getElementById("route_ID").value;
      const seat_count = document.getElementById("seat_count").value;

      // Викликати серверний обробник для отримання прогнозу
      fetch('/getPrediction', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              type_wagon,
              route_ID,
              seat_count,
          }),
      })
          .then(response => response.json())
          .then(predictionData => {
              console.log('Прогноз отримано:', predictionData);
              // Тут ви можете відобразити або використовувати прогноз на своїй сторінці
          })
          .catch(error => {
              console.error('Помилка отримання прогнозу:', error);
          });
  };
});
