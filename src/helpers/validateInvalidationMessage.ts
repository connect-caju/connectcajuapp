const validateInvalidationMessage = (message: any, errors: any, setErrors: any) => {
  const retrievedMessage = message?.trim();

  if (
    retrievedMessage === "" ||
    retrievedMessage === null ||
    retrievedMessage === undefined
  ) {
    setErrors({
      ...errors,
      invalidationMessage: "Indica o motivo de invalidação.",
    });
    return false;
  }

  return retrievedMessage;
};

export default validateInvalidationMessage;
