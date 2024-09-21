// module.exports = (existingCommand, localCommand) => {
//   const {
//     name: existingName,
//     description: existingDescription,
//     options: existingOptions = [],
//   } = existingCommand;
//   const {
//     data: {
//       name: localName,
//       description: localDescription,
//       options: localOptions = [],
//     },
//   } = localCommand;

//   const hasDifferences = (a, b) => JSON.stringify(a) !== JSON.stringify(b);

//   const checkOptions = (existingOpts, localOpts) => {
//     return localOpts.some((localOpt) => {
//       const existingOpt = existingOpts.find(
//         (opt) => opt.name === localOpt.name
//       );
//       if (!existingOpt) return true;
//       return hasDifferences(localOpt, existingOpt);
//     });
//   };

//   if (
//     existingName !== localName ||
//     existingDescription !== localDescription ||
//     checkOptions(existingOptions, localOptions)
//   ) {
//     return true;
//   }
//   return false;
// };

module.exports = (existing, local) => {
  const changed = (a, b) => JSON.stringify(a) !== JSON.stringify(b);

  if (
    changed(existing.name, local.data.name) ||
    changed(existing.description, local.data.description)
  ) {
    return true;
  }

  const optionChanged = changed(
    optionsArray(existing),
    optionsArray(local.data)
  );

  return optionChanged;

  function optionsArray(cmd) {
    const cleanObject = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === "object") {
          cleanObject(obj[key]);
          if (!obj[key] || (Array.isArray(obj[key]) && obj[key].length === 0)) {
            delete obj[key];
          }
        } else if (obj[key] === undefined) {
          delete obj[key];
        }
      }
    };

    const normalizeObject = (input) => {
      if (Array.isArray(input)) {
        return input.map((item) => normalizeObject(item));
      }

      const normalizedItem = {
        type: input.type,
        name: input.name,
        description: input.description,
        options: input.options ? normalizeObject(input.options) : undefined,
        required: input.required,
      };

      return normalizedItem;
    };

    return (cmd.options || []).map((options) => {
      let cleanedOption = JSON.parse(JSON.stringify(options));
      cleanedOption.options
        ? (cleanedOption.options = normalizeObject(cleanedOption.options))
        : (cleanedOption = normalizeObject(cleanedOption));
      cleanObject(cleanedOption);
      return {
        ...cleanedOption,
        choices: cleanedOption.choices
          ? JSON.stringify(cleanedOption.choices.map((c) => c.value))
          : null,
      };
    });
  }
};