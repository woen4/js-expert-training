import { join } from 'path';
import sinon from 'sinon';

import CarService from '../../src/service/carService';

const carsDatabase = join(__dirname, '..', '..', 'database', 'cars.json');
const mocks = {
  validCar: require('../mocks/valid-car.json'),
  validCarCategory: require('../mocks/valid-carCategory.json'),
  customer: require('../mocks/valid-customer.json'),
};
describe('CarService suit tests', () => {
  let carService = {},
    sandbox = {};

  beforeAll(() => {
    carService = new CarService({ cars: carsDatabase });
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return an random position of an array', () => {
    const array = [1, 2, 3, 4];
    const position = carService.getRandomIndexOfArray(array);
    expect(position).toBeGreaterThanOrEqual(0);
    expect(position).toBeLessThanOrEqual(3);
  });
  it('given a category and should return an available carId', async () => {
    const carIndex = 0;
    const carCategory = Object.create(mocks.validCarCategory);
    const car = carCategory.carIds[carIndex];

    sandbox
      .stub(carService, carService.getRandomIndexOfArray.name)
      .returns(carIndex);

    const result = await carService.chooseRandomCarId(carCategory);

    expect(carService.getRandomIndexOfArray.calledOnce).toBeTruthy();
    expect(result).toEqual(car);
  });

  it('given a carCategory it should return an available car', async () => {
    const car = mocks.validCar;
    const carCategory = Object.assign({}, mocks.validCarCategory);
    carCategory.carIds = [car.id];

    sandbox
      .stub(carService.carRepository, carService.carRepository.find.name)
      .resolves(car);

    sandbox.spy(carService, carService.chooseRandomCarId.name);

    const result = await carService.getAvailableCar(carCategory);

    expect(carService.carRepository.find.calledWithExactly(car.id));
    expect(carService.chooseRandomCarId.calledOnce).toBeTruthy();
    expect(car).toEqual(result);
  });
});
