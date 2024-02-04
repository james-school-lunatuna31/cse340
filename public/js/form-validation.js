function validateInput(inputElement) {
    let isValid = true; 

    if (inputElement.id === 'inv_make' || inputElement.id === 'inv_model' || inputElement.id === 'inv_description' || inputElement.id === 'inv_image' || inputElement.id === 'inv_thumbnail') {
      isValid = inputElement.value.trim() !== ''; 
    } else if (inputElement.id === 'inv_price') {
      isValid = inputElement.value > 0; 
    } else if (inputElement.id === 'inv_year') {
      const year = parseInt(inputElement.value, 10);
      isValid = year >= 1900 && year <= new Date().getFullYear();
    } else if (inputElement.id === 'inv_color') {
      isValid = /^[A-Za-z]+$/.test(inputElement.value);
    } else if (inputElement.id === 'inv_miles') {
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