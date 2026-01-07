document.addEventListener('DOMContentLoaded', function () {
  const passwordField = document.getElementById('passwordField');
  const reqs = {
    reqLength: document.getElementById('reqLength'),
    reqUpper: document.getElementById('reqUpper'),
    reqNumber: document.getElementById('reqNumber'),
    reqSymbol: document.getElementById('reqSymbol')
  };

  function updateChecklist() {
    const pwd = passwordField.value;

    toggleRequirement(reqs.reqLength, pwd.length >= 8);
    toggleRequirement(reqs.reqUpper, /[A-Z]/.test(pwd));
    toggleRequirement(reqs.reqNumber, /\d/.test(pwd));
    toggleRequirement(reqs.reqSymbol, /[!@#$%^&*(),.?":{}|<>_\-]/.test(pwd));
  }

  function toggleRequirement(element, isValid) {
    const icon = element.querySelector('.check-icon');
    if (isValid) {
      icon.textContent = '✅';
      element.classList.add('met');
      element.classList.remove('not-met');
    } else {
      icon.textContent = '❌';
      element.classList.remove('met');
      element.classList.add('not-met');
    }
  }

  passwordField.addEventListener('input', updateChecklist);
});

