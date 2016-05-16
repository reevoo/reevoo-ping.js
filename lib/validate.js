// validate.js
//
// Allows validation of hashes.

import internalValidate from 'validate.js';

internalValidate.validators.array = (value) => {
  return internalValidate.isArray(value) ? null : 'must be array';
};

// Wrap the validation function and raise an Error
// if there are any problems.
export default function validate(object, constraints) {
  const result = internalValidate(object, constraints, {
    format: 'flat',
  });

  if (result) {
    console.error(`[reevoo-ping] Tracking validation failed: ${result.join(', ')}`);
  }
}
