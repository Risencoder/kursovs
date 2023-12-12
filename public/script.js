function formatDate(dateString) {
    // Створюємо об'єкт дати з початкової рядкової значення
    const date = new Date(dateString);
  
    // Масиви назв місяців та днів тижня
    const monthNames = [
      "січня",
      "лютого",
      "березня",
      "квітня",
      "травня",
      "червня",
      "липня",
      "серпня",
      "вересня",
      "жовтня",
      "листопада",
      "грудня",
    ];
    const dayNames = [
      "нд",
      "пн",
      "вт",
      "ср",
      "чт",
      "пт",
      "сб",
    ];
  
    // Отримуємо значення дня, місяця та дня тижня з дати
    const day = date.getDate();
    const month = date.getMonth();
    const dayOfWeek = date.getDay();
  
    // Формуємо рядок з перетвореними значеннями
    const formattedDate = `${day}, ${monthNames[month]}, ${dayNames[dayOfWeek]}`;
  
    return formattedDate;
}
function calculateTravelTimeWithDate(departureDate, departureTime, arrivalTime, arrivalDate) {
// Розбиваємо рядки дати на компоненти
const departureDateComponents = departureDate.split("T")[0].split("-");
const arrivalDateComponents = arrivalDate.split("T")[0].split("-");

// Розбиваємо рядки часу на компоненти
const departureTimeComponents = departureTime.split(":");
const arrivalTimeComponents = arrivalTime.split(":");

// Створення об'єктів дати та встановлення значень
const departure = new Date(
    parseInt(departureDateComponents[0]),
    parseInt(departureDateComponents[1]) - 1,
    parseInt(departureDateComponents[2]),
    parseInt(departureTimeComponents[0]),
    parseInt(departureTimeComponents[1]),
    parseInt(departureTimeComponents[2])
);
const arrival = new Date(
    parseInt(arrivalDateComponents[0]),
    parseInt(arrivalDateComponents[1]) - 1,
    parseInt(arrivalDateComponents[2]),
    parseInt(arrivalTimeComponents[0]),
    parseInt(arrivalTimeComponents[1]),
    parseInt(arrivalTimeComponents[2])
);

// Отримання різниці в мілісекундах між датами
const timeDifference = arrival - departure;

// Розрахунок годин, хвилин та секунд в дорозі
const travelHours = Math.floor(timeDifference / (1000 * 60 * 60));
const travelMinutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
const travelSeconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

// Форматування рядка з часом в дорозі
const travelTime = `${travelHours} год ${travelMinutes} хв`;

return travelTime;
}
function formatTime(time) {
return time.substring(0, 5);
}
function mapWagonType(type_wagon) {
    switch (type_wagon) {
        case 'station':
            return ['Плацкарт', ' Стандартний'];
        case 'compartment':
            return ['Купе', ' Покращений'];
        case 'deluxe':
            return ['Люкс', ' Стандартний'];
    }
}
async function fetchWagons(route_ID) {
    const wagonsSearchUrl = `/searchWagons?route_ID=${route_ID}`;
    const wagonsResponse = await fetch(wagonsSearchUrl);
    const wagonsData = await wagonsResponse.json();
    return wagonsData;
}

async function ScanButtonClick() {
    const fromInput = document.getElementById('fromInput');
    const toInput = document.getElementById('toInput');
    const dateInput = document.getElementById('dateInput');
    const notFound = document.getElementById('notFound');
    const ticketsContainer = document.getElementById('ticketsContainer');
     /* const from ='Харків';
    const to = 'Тернопіль';
    const date = '2023-12-10';*/
    const from = fromInput.value;
    const to = toInput.value;
    const date = dateInput.value;

    notFound.style.display = 'none';
    ticketsContainer.innerHTML = '';

    try {
        const url = `/searchRoutes?from_location=${from}&to_location=${to}&to_departure_date=${date}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.length > 0) {
            data.forEach(async (el) => {
                const formattedDeparture = formatDate(el.to_departure_date);
                const formattedArrival = formatDate(el.to_arrival_date);
                const travelTime = calculateTravelTimeWithDate(el.to_departure_date, el.departure_time, el.arrival_time, el.to_arrival_date);
                const departure_time = formatTime(el.departure_time);
                const arrival_time = formatTime(el.arrival_time);

                const wagonsData = await fetchWagons(el.route_ID);
                const markup = `
                <div class="hidden-train_ticket">
                    <div class="text-wrapper-16"> ${travelTime}</div>
                    <div  class="text-wrapper-17">${formattedDeparture}</div>
                    <div class="from_to">${from} - ${to}</div>
                    <div class="overlap-4">
                        <div class="overlap-group-4">
                            <div  class="text-wrapper-18">${formattedArrival}</div>
                            <div  class="text-wrapper-19">${arrival_time}</div>
                        </div>
                        <img class="line-5" src="img/line-8.svg" />
                    </div>
                    <div class="text-wrapper-20">${departure_time}</div>
                    <img class="line-6" src="img/line-8.svg" />
                    <div class="overlap-5" >
                        <div class="text-wrapper-21">${mapWagonType(wagonsData[2].type_wagon)}</div>
                        <div class="text-wrapper-22">${wagonsData[2].seat_count - wagonsData[2].purchased_tickets} місця</div>
                        <button type="button" class="overlap-6" onclick="CreateTicketAndBuy('${wagonsData[2].route_ID}', '${wagonsData[2].wagon_ID}', '${wagonsData.filter(wagon => wagon.type_wagon === wagonsData[2].type_wagon).length}', '${wagonsData[2].type_wagon}', '${wagonsData[2].seat_count}', '${wagonsData[2].price}')">
                            <div class="text-wrapper-23">${wagonsData[2].price} грн</div>
                        </button>
                    </div>
                    <div class="overlap-7" >
                        <div class="text-wrapper-21">${mapWagonType(wagonsData[1].type_wagon)}</div>
                        <div class="text-wrapper-24">${wagonsData[1].seat_count - wagonsData[1].purchased_tickets} місця</div>
                        <button type="button" class="overlap-6" onclick="CreateTicketAndBuy('${wagonsData[1].route_ID}', '${wagonsData[1].wagon_ID}', '${wagonsData.filter(wagon => wagon.type_wagon === wagonsData[1].type_wagon).length}', '${wagonsData[1].type_wagon}', '${wagonsData[1].seat_count}', '${wagonsData[1].price}')">
                            <div class="text-wrapper-25">${wagonsData[1].price} грн</div>
                        </button>
                    </div>
                
                    <div class="overlap-8">
                        <div class="text-wrapper-21">${mapWagonType(wagonsData[0].type_wagon)}</div>
                        <div class="text-wrapper-24">${wagonsData[0].seat_count - wagonsData[0].purchased_tickets} місця</div>
                        <button type="button" class="overlap-6" onclick="CreateTicketAndBuy('${wagonsData[0].route_ID}', '${wagonsData[0].wagon_ID}', '${wagonsData.filter(wagon => wagon.type_wagon === wagonsData[0].type_wagon).length}', '${wagonsData[0].type_wagon}', '${wagonsData[0].seat_count}', '${wagonsData[0].price}')">
                            <div class="text-wrapper-26">${wagonsData[0].price} грн</div>
                        </button>
                    </div>
                </div>
                `;;
                ticketsContainer.innerHTML += markup;
            });
        }
    } catch (error) {
        notFound.style.display = 'block';
        console.error('Помилка запиту:', error);
    }

}



function CreateTicketAndBuy(route_ID, wagonID, WagonCount, typeWagon, seatCount, price) {
    const ticketsContainer = document.getElementById('ticketsContainer');
    ticketsContainer.innerHTML = ''; // Очистити контейнер перед вставкою нового коду

    // масив параметрів на основі WagonCount
    const optionsArray = Array.from({ length: WagonCount }, (_, index) => index + 1);
    // Створення розмітки HTML для вибраного елемента
    const selectOptions = optionsArray.map(optionValue => `<option value="${optionValue}">${optionValue}</option>`).join('');

    const choiseMarkup = `
        <div class="frame-2">
            <div class="passenger">
                <div class="text-wrapper-vagon">Номер вагона</div>
                <select id="vagon" class="vagonSelect">
                    ${selectOptions}
                </select>
                <div class="text-wrapper-28">Ім’я</div>
                <div class="text-wrapper-29">Прізвище</div>
                <input id="second-name" type="text" class="text-wrapper-30 rectangle-3" />
                <input id="first-name" type="text" class="text-wrapper-30 rectangle-4" />
            </div>
            <div class="overlap-11">
                <div class="text-wrapper-31">Номер телефону</div>
                <div class="text-wrapper-32">E-mail</div>
                <input id="email" class="text-wrapper-30 rectangle-5" />
                <input id="phone" class="text-wrapper-30 rectangle-6" />
                <button id="payButton" type="button" class="overlap-group-5" onclick="PayButtonClick(${route_ID} , document.getElementById('first-name').value, document.getElementById('second-name').value, document.getElementById('email').value, document.getElementById('phone').value, ${wagonID}, ${price})">${price} грн</button>
                <div class="text-wrapper-34">До сплати:</div>
            </div>
        </div>
    `;
    ticketsContainer.innerHTML = choiseMarkup;
}



function formatCreditCardNumber(input) {
    // Remove non-numeric characters
    const numericValue = input.value.replace(/[^\d]/g, '');

    // Format the numeric value with spaces
    const formattedValue = numericValue
      .replace(/(\d{4})(?=\d)/g, '$1 ')
      .trim();

    // Set the formatted value back to the input
    input.value = formattedValue;
  }

  function PayButtonClick(route_ID, firstName, secondName, email, phone, wagonID) {
    var ticketsContainer = document.getElementById('ticketsContainer');
    ticketsContainer.innerHTML = '';

    var newCode = `
    <div class="overlap-group-wrapper">
        <div class="overlap-12">
            <div class="text-wrapper-35">Термін дії</div>
            <div class="text-wrapper-36">Номер картки</div>
            <input id="card-number" type="tel" maxlength="19" class="rectangle-7" placeholder="XXXX XXXX XXXX XXXX" oninput="formatCreditCardNumber(this)"/>
            
            <select id="validity-month" class="overlap-13">
                <!-- Options for months -->
            </select>

            <select id="validity-year" class="overlap-14">
                <!-- Options for years -->
            </select>

            <div class="text-wrapper-39">CVV2</div>
            <input id="code" type="text" maxlength="3" class="rectangle-8" oninput="this.value=this.value.replace(/\D/g,'')">

            <button type="button" class="overlap-group-6" onclick="sendPaymentData('${route_ID}', '${wagonID}', '${firstName}', '${secondName}', '${email}', '${phone}')">
                <div class="text-wrapper-40">Сплатити</div>
            </button>
            <div class="text-wrapper-41">/</div>
        </div>
    </div>
    `;

    ticketsContainer.innerHTML = newCode;

    const validityMonthSelect = document.getElementById('validity-month');
    const validityYearSelect = document.getElementById('validity-year');
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i < 10 ? `0${i}` : `${i}`;
        option.textContent = i < 10 ? `0${i}` : `${i}`;
        validityMonthSelect.appendChild(option);
    }
    for (let i = 2023; i <= 2033; i++) {
        const option = document.createElement('option');
        option.value = `${i}`;
        option.textContent = `${i}`;
        validityYearSelect.appendChild(option);
    }
}

async function sendPaymentData(route_ID, wagonID, firstName, secondName, email, phone) {
    const cardNumber = document.getElementById('card-number').value;

    const paymentData = {
        wagon_ID: wagonID,
        firstName: firstName,
        secondName: secondName,
        email: email,
        phone: phone,
        cardNumber: cardNumber,
        route_ID: route_ID
    };

    try {
        var ticketsContainer = document.getElementById('ticketsContainer');
        ticketsContainer.innerHTML = '';
        const response = await fetch('/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Успішно відправлено:', data);

        // Обробка відповіді від сервера (якщо необхідно)
    } catch (error) {
        console.error('Помилка:', error);
    }
}

  