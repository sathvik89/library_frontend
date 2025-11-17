function validatePasswords(password, confirmPassword) {
    const errors = {};
  
    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
  
    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  
    // If no errors, return null
    return Object.keys(errors).length > 0 ? errors : null;
  }

  export default validatePasswords;