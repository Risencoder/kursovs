# Імпорт необхідних бібліотек
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from sqlalchemy import create_engine
import matplotlib.pyplot as plt
import joblib

# Параметри підключення до бази даних
host = "localhost"
port = 3306
user = "root"
password = "1111"
database = "Intercitypass"

# З'єднання з базою даних
db_engine = create_engine(f'mysql://{user}:{password}@{host}:{port}/{database}', echo=True)

# Запит для отримання даних з бази даних
query = "SELECT type_wagon, route_ID, purchased_tickets, seat_count FROM wagons"

df = pd.read_sql(query, con=db_engine)

# Розділення даних на ознаки та цільову змінну
X = df[['type_wagon', 'route_ID', 'seat_count']]
y = df['purchased_tickets']

# Закодування категоріальних ознак
X_encoded = pd.get_dummies(X, columns=['type_wagon'], prefix=['type_wagon'])

# Розділення навчального та тестового наборів
X_train, X_test, y_train, y_test = train_test_split(X_encoded, y, test_size=0.2, random_state=42)

# Створення та навчання моделі
model = RandomForestRegressor()
model.fit(X_train, y_train)

# Виведення якості навчання
training_mse = mean_squared_error(y_train, model.predict(X_train))
print(f'Training Mean Squared Error: {training_mse}')

# Перевірка якості моделі на тестовому наборі
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print(f'Mean Squared Error: {mse}')

# Використання моделі для прогнозування
def predict_wagon_load(type_wagon, route_ID, seat_count):
    input_data = {'type_wagon': [type_wagon], 'route_ID': [route_ID], 'seat_count': [seat_count]}
    input_df = pd.DataFrame(input_data)

    # Закодувати вхідні дані з використанням тих самих імен ознак, що і під час навчання
    input_encoded = pd.get_dummies(input_df, columns=['type_wagon'], prefix=['type_wagon'])
    input_encoded = input_encoded.reindex(columns=X_train.columns, fill_value=0)

    prediction = model.predict(input_encoded)
    return prediction[0]

# Прогноз для кожного типу вагона на кожному маршруті
for wagon_type in df['type_wagon'].unique():
    for route_ID in df['route_ID'].unique():
        seat_count = df[(df['type_wagon'] == wagon_type) & (df['route_ID'] == route_ID)]['seat_count'].iloc[0]
        predicted_load = predict_wagon_load(type_wagon=wagon_type, route_ID=route_ID, seat_count=seat_count)

        # Розрахунок заповненості вагона відсотком
        fill_percentage = (predicted_load / seat_count) * 100

        # Виведення тільки вагонів, які будуть заповнені більше ніж на 80%
        if fill_percentage > 80:
            print(f'Прогнозоване навантаження вагона типу {wagon_type} на маршруті {route_ID}: {predicted_load:.2f} ({fill_percentage:.2f}%)')
            print(f'Додайте вагони на маршрут {route_ID} типу {wagon_type}\n')

# Збереження моделі
model_filename = 'wagon_load_model.joblib'
joblib.dump(model, model_filename)
print(f'Model saved as {model_filename}')

