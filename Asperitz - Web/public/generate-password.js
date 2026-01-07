document.addEventListener('DOMContentLoaded', function () {
  const passwordField = document.getElementById('passwordField');
  const generatePasswordBtn = document.getElementById('generatePassword');

  if (!generatePasswordBtn) {
    console.error('Generate Password button not found!');
    return;
  }

  generatePasswordBtn.addEventListener('click', function () {
    const generatedPassword = generateSecurePassword();
    passwordField.value = generatedPassword;
    navigator.clipboard.writeText(generatedPassword);

    const notification = document.createElement('div');
    notification.classList.add('clipboard-notification');
    notification.textContent = '🔑 Password copied to clipboard!';
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);
    
    passwordField.dispatchEvent(new Event('input'));
  });

  function generateSecurePassword() {
    const length = 12;
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+";
    const allChars = uppercase + lowercase + numbers + symbols;

    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password.split("").sort(() => Math.random() - 0.5).join(""); 
  }
});
