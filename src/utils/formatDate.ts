const formatDate = (value: Date): string =>
  Intl.DateTimeFormat('en-GB').format(value);

export default formatDate;
