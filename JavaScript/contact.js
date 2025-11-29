window.onload = function() {

const phoneInput = document.querySelector('#phone-number');

const formatToPhone = (event) => {
    const digits = event.target.value.replace(/\D/g, '').substring(0, 10); // Extract only digits
    const areaCode = digits.substring(0, 3);
    const prefix = digits.substring(3, 6);
    const suffix = digits.substring(6, 10);

    if (digits.length > 6) {
        event.target.value = `(${areaCode}) ${prefix}-${suffix}`;
    } else if (digits.length > 3) {
        event.target.value = `(${areaCode}) ${prefix}`;
    } else if (digits.length > 0) {
        event.target.value = `(${areaCode}`;
    }
};

phoneInput.addEventListener('keyup', formatToPhone);

}