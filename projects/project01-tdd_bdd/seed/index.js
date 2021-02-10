import faker from 'faker';
import { join } from 'path';
import { writeFile } from 'fs/promises';

import Car from '../src/entities/car';
import CarCategory from '../src/entities/carCategory';
import Customer from '../src/entities/customer';

const senderBaseFolder = join(__dirname, '..', 'database');

const ITEMS_AMOUNT = 2;
const cars = [],
  customers = [];

const carCategory = new CarCategory({
  id: faker.random.uuid(),
  name: faker.vehicle.type(),
  carIds: [],
  price: faker.finance.amount(20, 100),
});

for (let i = 0; i < ITEMS_AMOUNT; i++) {
  const car = new Car({
    id: faker.random.uuid(),
    name: faker.vehicle.model(),
    available: true,
    gasAvailable: true,
    releaseTear: faker.date.past().getFullYear(),
  });

  const customer = new Customer({
    id: faker.random.uuid(),
    name: faker.name.firstName,
    age: faker.random.number({ min: 18, max: 50 }),
  });

  carCategory.carIds.push(car.id);
  cars.push(car);
  customers.push(customer);
}

const write = async (fileName, data) => {
  await writeFile(join(senderBaseFolder, fileName), JSON.stringify(data));
};

(async () => {
  await write('cars.json', cars);
  await write('customers.json', customers);
  await write('carsCategories.json', [carCategory]);
  console.log({ cars, carCategory });
})();
