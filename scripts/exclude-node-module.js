const path = require('path');

/**
 * @see https://github.com/webpack/webpack/issues/2031#issuecomment-317589620
 */
module.exports = function excludeNodeModulesForAllOS(modules) {
  let pathSep = path.sep;
  if (pathSep == '\\')
    // must be quoted for use in a regexp:
    pathSep = '\\\\';
  const moduleRegExps = modules.map(function (modName) {
    return new RegExp('node_modules' + pathSep + modName);
  });

  return function (modulePath) {
    if (/node_modules/.test(modulePath)) {
      for (let i = 0; i < moduleRegExps.length; i++)
        if (moduleRegExps[i].test(modulePath)) {
          return false;
        }
      return true;
    }
    return false;
  };
};
