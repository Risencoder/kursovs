-- Створення бази даних Intercitypass з вказаною кодуванням та колацією
CREATE DATABASE IF NOT EXISTS Intercitypass CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Intercitypass;

-- Створення таблиці маршрутів
CREATE TABLE routes (
    route_ID INT AUTO_INCREMENT PRIMARY KEY,  -- Ідентифікатор маршруту (автоінкремент)
    from_location VARCHAR(255) NOT NULL,      -- Початкова локація
    to_location VARCHAR(255) NOT NULL,        -- Кінцева локація
    to_departure_date VARCHAR(255) NOT NULL,  -- Дата відправлення (у форматі рядка)
    departure_time TIME NOT NULL,             -- Час відправлення
    to_arrival_date VARCHAR(255) NOT NULL,    -- Дата прибуття (у форматі рядка)
    arrival_time TIME NOT NULL                -- Час прибуття
);

-- Створення таблиці квитків
CREATE TABLE tickets (
    ticket_ID INT AUTO_INCREMENT PRIMARY KEY, -- Ідентифікатор квитка (автоінкремент)
    wagon_ID INT,                             -- Ідентифікатор вагона, до якого прикріплений квиток
    firstName VARCHAR(255),                   -- Ім'я пасажира
    secondName VARCHAR(255),                  -- Прізвище пасажира
    phone VARCHAR(255),                        -- Телефонний номер пасажира
    email VARCHAR(255),                        -- Email пасажира
    cardNumber VARCHAR(255),                   -- Номер кредитної картки пасажира
    purchase_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Час покупки квитка (за замовчуванням - поточний час)
    route_ID INT,                             -- Ідентифікатор маршруту, до якого прикріплений квиток
    FOREIGN KEY (route_ID) REFERENCES routes(route_ID) -- Зовнішній ключ, посилається на ідентифікатор маршруту
);

-- Створення таблиці вагонів
CREATE TABLE wagons (
    wagon_ID INT AUTO_INCREMENT PRIMARY KEY, -- Ідентифікатор вагона (автоінкремент)
    route_ID INT,                             -- Ідентифікатор маршруту, до якого прикріплений вагон
    type_wagon VARCHAR(255) NOT NULL,         -- Тип вагона
    price VARCHAR(255) NOT NULL,              -- Ціна вагона (може бути текстовим рядком)
    seat_count INT NOT NULL,                  -- Кількість місць в вагоні
    purchased_tickets INT NOT NULL,           -- Кількість придбаних квитків для цього вагона
    FOREIGN KEY (route_ID) REFERENCES routes(route_ID) -- Зовнішній ключ, посилається на ідентифікатор маршруту
);

-- Додавання потягу
INSERT INTO routes (from_location, to_location, to_departure_date, departure_time, to_arrival_date, arrival_time)
VALUES ('Київ', 'Львів', '2023-12-10', '08:00:00', '2023-12-11', '11:00:00');

-- Додавання вагона плацкарт
INSERT INTO wagons (route_ID, type_wagon, price, seat_count, purchased_tickets)
VALUES (1, 'station', '150', 40, 0);

-- Додавання вагона купе
INSERT INTO wagons (route_ID, type_wagon, price, seat_count, purchased_tickets)
VALUES (1, 'compartment', '200', 20, 0);

-- Додавання вагона люкс
INSERT INTO wagons (route_ID, type_wagon, price, seat_count, purchased_tickets)
VALUES (1, 'deluxe', '300', 10, 0);
