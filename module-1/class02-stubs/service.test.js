import Service from './service';
import sinon from 'sinon';
import { deepStrictEqual } from 'assert';

const URL_1 = 'https://swapi.dev/api/planets/1/';
const URL_2 = 'https://swapi.dev/api/planets/2/';

const mocks = {
  tatooine: require('./mocks/tatooine.json'),
  alderaan: require('./mocks/alderaan.json'),
};

(async () => {
  const service = new Service();
  {
    const stub = sinon.stub(service, service.makeRequest.name);
    stub.withArgs(URL_1).resolves(mocks.tatooine);
    stub.withArgs(URL_2).resolves(mocks.alderaan);
  }
  {
    const expected = {
      name: 'Tatooine',
      surfaceWater: '1',
      appearedIn: 5,
    };

    const result = await service.getPlanets(URL_1);

    deepStrictEqual(JSON.stringify(result), JSON.stringify(expected));
  }
  {
    const expected = {
      name: 'Alderaan',
      surfaceWater: '40',
      appearedIn: 2,
    };

    const result = await service.getPlanets(URL_2);

    deepStrictEqual(JSON.stringify(result), JSON.stringify(expected));
  }
})();
