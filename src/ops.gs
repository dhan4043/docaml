// Define the types of binary operations and their precedence
const OP2 = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
};

// Define the JS equivalents for binary operations
const INTERP_OP2 = {
  '+': (left, right) => left + right,
  '-': (left, right) => left - right,
  '*': (left, right) => left * right,
  '/': (left, right) => left / right,
};
