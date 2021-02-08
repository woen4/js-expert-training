class Calc {
  pow(base, exponent, accumulated = base) {
    if (exponent === 1) {
      return accumulated;
    }
    return this.pow(base, exponent - 1, accumulated * base);
  }
}

export default Calc;
