function validateInput(inputElement) {
    let isValid = true; 

    if (inputElement.id === 'itemName' || inputElement.id === 'make' || inputElement.id === 'model' || inputElement.id === 'description') {
      isValid = inputElement.value.trim() !== ''; 
    } else if (inputElement.id === 'itemPrice') {
      isValid = inputElement.value > 0; 
    } else if (inputElement.id === 'year') {
      const year = parseInt(inputElement.value, 10);
      isValid = year >= 1900 && year <= new Date().getFullYear();
    } else if (inputElement.id === 'color') {
      isValid = /^[A-Za-z]+$/.test(inputElement.value);
    } else if (inputElement.id === 'miles') {
      isValid = /^\d+$/.test(inputElement.value); 
    }

    if (inputElement === document.activeElement) { 
      if (!isValid) {
        inputElement.classList.remove('valid');
        inputElement.classList.add('invalid');
      } else {
        inputElement.classList.remove('invalid');
        inputElement.classList.add('valid');
      }
    } else {
      if (!isValid) {
        inputElement.classList.remove('valid');
        inputElement.classList.add('invalid');
      } else {
        inputElement.classList.remove('invalid', 'valid');
      }
    }
}