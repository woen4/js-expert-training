import BaseRepository from '../repository/bases/baseRepository';

class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars });
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
}

export default CarService;
