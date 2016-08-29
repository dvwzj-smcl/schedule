/**
 * see: https://github.com/christianalfoni/formsy-react/blob/master/API.md#validators
 */

const ErrorMessage = {
    required: "This field is required",
    isWord: "Please only use letters",
    isNumeric: "Please provide a number",
    isUrl: "Please provide a valid URL",
    isAlphanumeric: "Please provide a letters or number",
    isEmail: "Please provide a valid email",
    maxLength: "You can not type in more than 50 characters",
    minLength: "You can not type in less than 3 characters",
    equalsField: "Passwords do not match"
};

export default ErrorMessage;
