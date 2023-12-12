# Загальний імпорт бібліотек та функцій
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sqlalchemy import create_engine

# Імпорт моделі
model_filename = 'wagon_load_model.joblib'
loaded_model = joblib.load(model_filename)

# Імпорт функції для прогнозу
def predict_wagon_load(input_df, X_train):
    # Закодувати вхідні дані так само, як під час навчання моделі
    input_encoded = pd.get_dummies(input_df, columns=['type_wagon'], prefix=['type_wagon'])
    
    # Переконайтеся, що вхідні дані мають такі самі колонки, як і навчальний набір
    input_encoded = input_encoded.reindex(columns=X_train.columns, fill_value=0)

    prediction = loaded_model.predict(input_encoded)
    return prediction[0]

# Параметри підключення до бази даних
host = "localhost"
port = 3306
user = "root"
password = "1111"
database = "Intercitypass"

# З'єднання з базою даних
db_engine = create_engine(f'mysql://{user}:{password}@{host}:{port}/{database}', echo=True)

# Запит для отримання даних з бази даних
query = "SELECT type_wagon, route_ID, seat_count FROM wagons"
df = pd.read_sql(query, con=db_engine)

# Перевірка, чи є колонка "purchased_tickets" в таблиці
if 'purchased_tickets' not in df.columns:
    print("Увага: Колонка 'purchased_tickets' відсутня в таблиці 'wagons'")
    exit()

# Розділення даних на ознаки та цільову змінну (змініть це залежно від вашого реального навчального набору)
X_train, _, _, _ = train_test_split(df[['type_wagon', 'route_ID', 'seat_count']], df['purchased_tickets'], test_size=0.2, random_state=42)

# Ваш код для використання моделі та прогнозу, наприклад:
for row in df.itertuples():
    input_data = pd.DataFrame({'type_wagon': [row.type_wagon], 'route_ID': [row.route_ID], 'seat_count': [row.seat_count]})
    predicted_load = predict_wagon_load(input_data, X_train)
    print(f'Прогнозоване навантаження: {predicted_load}')
