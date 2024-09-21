const path = require("path");
const getAllFiles = require("../utils/getAllFiles");

module.exports = (exception = []) => {
  let buttons = [];
  const buttonFiles = getAllFiles(path.join(__dirname, "..", "buttons"));

  for (const buttonFile of buttonFiles) {
    const buttonObject = require(buttonFile);

    if (exception.includes(buttonObject.name)) continue;
    buttons.push(buttonObject);
  }

  return buttons;
};