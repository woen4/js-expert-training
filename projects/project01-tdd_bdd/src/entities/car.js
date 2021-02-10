import Base from './bases/base';

class Car extends Base {
  constructor({ id, name, releaseTear, available, gasAvailable }) {
    super({ id, name });
    this.releaseTear = releaseTear;
    this.available = available;
    this.gasAvailable = gasAvailable;
  }
}

export default Car;
