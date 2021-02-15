import BaseRepository from '../repository/bases/baseRepository';
import Tax from '../entities/tax';
import Transaction from '../entities/transaction';
class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars });

    this.taxesBasedOnAge = Tax.taxesBasedOnAge;

    this.currencyFormat = new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  getRandomIndexOfArray(array) {
    const listLength = array.length;
    const randomIndex = Math.floor(Math.random() * listLength);

    return randomIndex;
  }

  chooseRandomCarId(carCategory) {
    const randomIndex = this.getRandomIndexOfArray(carCategory.carIds);
    const randomCarId = carCategory.carIds[randomIndex];
    return randomCarId;
  }

  async getAvailableCar(carCategory) {
    const randomCarId = this.chooseRandomCarId(carCategory);
    const randomCar = await this.carRepository.find(randomCarId);

    return randomCar;
  }

  calculateFinalPrice(customer, carCategory, numberOfDays) {
    const { age } = customer;
    const { price } = carCategory;
    const { then: tax } = this.taxesBasedOnAge.find(
      (tax) => age >= tax.from && age <= tax.to
    );

    const finalPrice = price * tax * numberOfDays;
    const formattedPrice = this.currencyFormat.format(finalPrice);

    return formattedPrice;
  }

  async rent(customer, carCategory, numberOfDays) {
    const car = await this.getAvailableCar(carCategory);
    const finalPrice = this.calculateFinalPrice(
      customer,
      carCategory,
      numberOfDays
    );

    const today = new Date();
    today.setDate(today.getDate() + numberOfDays);
    const optionsDate = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    const dueDate = today.toLocaleDateString('pt-br', optionsDate);

    const transaction = new Transaction({
      customer,
      dueDate,
      car,
      amount: finalPrice,
    });

    return transaction;
  }
}

export default CarService;
