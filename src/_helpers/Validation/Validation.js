import { Rules } from './Rules';

export function Validation(state, rules) {
  var errobj = {};
  for (let i = 0; i < rules.length; i++) {
    Object.keys(state).forEach((index) => {
      if (index === rules[i].field_name) {
        /**call rule file here */
        var errormsg = Rules(state[index], rules[i]);
        if (errormsg !== '') {
          if (
            (!rules[i].isRequired && state[index] === '') ||
            (Array.isArray(state[index]) && state[index].length === 0)
          ) {
            errobj[index] = '';
          } else {
            errobj[index] = errormsg;
          }
        } else {
          errobj[index] = '';
        }
      }
    });
  }
  return errobj;
}
