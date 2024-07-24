function limitDecimalToOnePlace(value?: number) {
  if (!value) {
    return 0;
  }
  return parseFloat(value.toFixed(1));
}
export { limitDecimalToOnePlace };
