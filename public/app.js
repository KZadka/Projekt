// Plik startowy JS dla frontendu
// Tutaj pojawi się logika formularza i pobierania cytatów

// Formularz rejestracji/logowania
const app = document.getElementById('app');

app.innerHTML = `
  <h2>Rejestracja</h2>
  <form id="registerForm" autocomplete="off">
    <label for="username">Nazwa użytkownika</label>
    <input type="text" id="username" name="username" required minlength="4" maxlength="20">
    <div class="error" id="usernameError"></div>

    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>
    <div class="error" id="emailError"></div>

    <label for="password">Hasło</label>
    <input type="password" id="password" name="password" required minlength="8">
    <div class="error" id="passwordError"></div>

    <label for="confirmPassword">Powtórz hasło</label>
    <input type="password" id="confirmPassword" name="confirmPassword" required>
    <div class="error" id="confirmPasswordError"></div>

    <button type="submit">Zarejestruj się</button>
  </form>
  <div id="registerSuccess" class="success"></div>
`;

const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', function (e) {
  e.preventDefault();
  let valid = true;

  // Walidacja nazwy użytkownika
  const username = registerForm.username.value.trim();
  const usernameError = document.getElementById('usernameError');
  if (username.length < 4 || username.length > 20) {
    usernameError.textContent = 'Nazwa użytkownika musi mieć 4-20 znaków.';
    valid = false;
  } else {
    usernameError.textContent = '';
  }

  // Walidacja emaila (regex)
  const email = registerForm.email.value.trim();
  const emailError = document.getElementById('emailError');
  const emailRegex = /^[\w-.]+@[\w-]+\.[a-z]{2,}$/i;
  if (!emailRegex.test(email)) {
    emailError.textContent = 'Nieprawidłowy adres email.';
    valid = false;
  } else {
    emailError.textContent = '';
  }

  // Walidacja hasła
  const password = registerForm.password.value;
  const passwordError = document.getElementById('passwordError');
  // Minimum 8 znaków, litery, cyfry, znak specjalny
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  if (!passwordRegex.test(password)) {
    passwordError.textContent = 'Hasło musi mieć min. 8 znaków, zawierać litery, cyfry i znak specjalny.';
    valid = false;
  } else {
    passwordError.textContent = '';
  }

  // Powtórzenie hasła
  const confirmPassword = registerForm.confirmPassword.value;
  const confirmPasswordError = document.getElementById('confirmPasswordError');
  if (password !== confirmPassword) {
    confirmPasswordError.textContent = 'Hasła nie są zgodne.';
    valid = false;
  } else {
    confirmPasswordError.textContent = '';
  }

  if (valid) {
    document.getElementById('registerSuccess').textContent = 'Rejestracja zakończona sukcesem!';
    setTimeout(showQuoteForm, 1000);
    registerForm.reset();
  } else {
    document.getElementById('registerSuccess').textContent = '';
  }
});

// Dodanie formularza do pobierania cytatów po rejestracji
function showQuoteForm() {
  app.innerHTML = `
    <h2>Witaj!</h2>
    <form id="quoteForm">
      <label for="topic">Podaj temat cytatu:</label>
      <input type="text" id="topic" name="topic" required placeholder="np. motivation, love">
      <button type="submit">Pobierz cytat</button>
    </form>
    <div id="quoteResult"></div>
    <button id="logoutBtn">Wyloguj</button>
  `;

  document.getElementById('quoteForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const topic = document.getElementById('topic').value.trim();
    const quoteResult = document.getElementById('quoteResult');
    quoteResult.textContent = 'Ładowanie...';
    try {
      const res = await fetch(`http://localhost:3000/api/quote?topic=${encodeURIComponent(topic)}`);
      const data = await res.json();
      if (res.ok) {
        quoteResult.innerHTML = `<blockquote>"${data.content}"<br><small>- ${data.author}</small></blockquote>`;
      } else {
        quoteResult.textContent = data.error || 'Błąd pobierania cytatu.';
      }
    } catch (err) {
      quoteResult.textContent = 'Błąd połączenia z serwerem.';
    }
  });

  document.getElementById('logoutBtn').onclick = () => window.location.reload();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker zarejestrowany:', reg.scope))
      .catch(err => console.log('Błąd rejestracji Service Workera:', err));
  });
}
