function wrap(value: number, min: number, max: number) {
  return ((((value - min) % (max - min)) + (max - min)) % (max - min)) + min;
}

export default wrap;
