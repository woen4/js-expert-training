import { join } from 'path';
import sinon from 'sinon';

import Transaction from '../../src/entities/transaction';
import CarService from '../../src/service/carService';

const carsDatabase = join(__dirname, '..', '..', 'database', 'cars.json');
const mocks = {
  validCar: require('../mocks/valid-car.json'),
  validCarCategory: require('../mocks/valid-carCategory.json'),
  validCustomer: require('../mocks/valid-customer.json'),
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

  it('given a carCategory, customer and numberOfDays it should calculate final amount is real', () => {
    const customer = Object.assign({}, mocks.validCustomer);
    customer.age = 50;

    const carCategory = Object.assign({}, mocks.validCarCategory);
    carCategory.price = 37.6;

    const numberOfDays = 5;

    sandbox.stub(carService, 'taxesBasedOnAge').get(() => [
      {
        from: 40,
        to: 50,
        then: 1.3,
      },
    ]);

    const expected = carService.currencyFormat.format(244.4);
    const result = carService.calculateFinalPrice(
      customer,
      carCategory,
      numberOfDays
    );

    expect(result).toBe(expected);
  });

  it('given a customer and an carCategory it should return a transaction recipient', async () => {
    const car = mocks.validCar;
    const carCategory = {
      ...mocks.validCarCategory,
      price: 37.6,
      carIds: [car.id],
    };

    const customer = { ...mocks.validCustomer, age: 20 };

    const numberOfDays = 5;
    const dueDate = '10 de novembro de 2020';

    const now = new Date(2020, 10, 5);
    sandbox.useFakeTimers(now.getTime());

    sandbox
      .stub(carService.carRepository, carService.carRepository.find.name)
      .resolves(car);

    const expectedAmount = carService.currencyFormat.format(206.8);

    const result = await carService.rent(customer, carCategory, numberOfDays);

    const expected = new Transaction({
      customer,
      car,
      dueDate,
      amount: expectedAmount,
    });

    expect(result).toEqual(expected);
  });
});
