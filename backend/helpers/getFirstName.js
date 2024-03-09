function getFirstName(fullName) {
  // Split the full name based on a space delimiter
  const parts = fullName.split(" ");
  // Return the first part (first name)
  return parts[0];
}

module.exports = { getFirstName };
