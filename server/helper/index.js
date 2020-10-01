// Capitalize every first letter of each word in an array
export const capitalize = (userinput) => {
  const finalString = [];
  userinput.split(' ').forEach((word) => {
    finalString.push(word.replace(word[0], word[0].toUpperCase()));
  });
  return finalString.join(' ');
};
