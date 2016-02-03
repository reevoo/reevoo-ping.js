// validate.js
//
// Allows validation of hashes.

import internalValidate from 'validate.js';

// Wrap the validation function and raise an Error
// if there are any problems.
export default function validate(object, constraints) {
  const result = internalValidate(object, constraints, {
    format: 'flat',
  });

  if (result) {
    throw new Error(`Validation failed: ${result.join()}`);
  }
}