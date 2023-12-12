function attemptLogin() {
  // Отримати введені дані користувача
  var login = document.getElementById("login").value;
  var password = document.getElementById("password").value;

  // Проста перевірка для демонстраційних цілей
  if (login === "admin" && password === "adminpassword") {
      // Автентифікація успішна
      window.location.href = "http://127.0.0.1:8080/admin2";
      alert("Автентифікація успішна!");
  } else {
      // Автентифікація не вдалась
      alert("Автентифікація не вдалась: Невірні облікові дані");
  }
}