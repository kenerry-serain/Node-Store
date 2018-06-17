'use strict';

let errors = [];

function IntegrityKeeper() {
    errors = [];
}

IntegrityKeeper.prototype.isRequired = (value, message) => {
    if (!value || value.length <= 0)
        errors.push({ message: message });
}

IntegrityKeeper.prototype.hasMinLength = (value, minLength, message) => {
    if (!value || value.length < minLength)
        errors.push({ message: message });
}

IntegrityKeeper.prototype.hasMaxLength = (value, maxLength, message) => {
    if (!value || value.length < maxLength)
        errors.push({ message: message });
}

IntegrityKeeper.prototype.hasMinLength = (value, maxLength, message) => {
    if (!value || value.length > maxLength)
        errors.push({ message: message });
}

IntegrityKeeper.prototype.isEmail = (email, message) => {
    var regex = new RegExp('');
    if (!regex.test(email))
        errors.push({ message: message });
}


IntegrityKeeper.prototype.errors = () => {
    return errors;
}

IntegrityKeeper.prototype.clear = () => {
    errors = [];
}

IntegrityKeeper.prototype.isValid = () => {
    return errors.length === 0;
}

module.exports = IntegrityKeeper;