import Base from './bases/base';

class Customer extends Base {
  constructor({ id, name, age }) {
    super({ id, name });
    this.age = age;
  }
}

export default Customer;
