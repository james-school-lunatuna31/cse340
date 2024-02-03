function validateInput(inputElement) {
    let isValid = true; 

    if (inputElement.id === 'itemName') {
      isValid = inputElement.value.trim() !== ''; 
    } else if (inputElement.id === 'itemPrice') {
      isValid = inputElement.value > 0; 
    }else if (inputElement.id === 'classificationName'){
        isValid = !inputElement.value.includes(' ');
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