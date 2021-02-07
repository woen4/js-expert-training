import { error } from './src/constants';
const File = require('./src/file');
import { rejects, deepStrictEqual } from 'assert';

(async () => {
  {
    const filePath = './mocks/emptyFile-invalid.csv';
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.default.csvToJson(filePath);
    await rejects(result, rejection);
  }
  {
    const filePath = './mocks/fourItems-invalid.csv';
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.default.csvToJson(filePath);
    await rejects(result, rejection);
  }
  {
    const filePath = './mocks/threeItems-valid.csv';

    const result = await File.default.csvToJson(filePath);
    const expected = [
      {
        name: 'Kaio Woen',
        id: 1,
        profession: 'FullStack Developer',
        birthDay: 2002,
      },
      {
        name: 'Erick Wendel',
        id: 2,
        profession: 'Javascript Specialist',
        birthDay: 1996,
      },
      {
        name: 'Landerson Miguel',
        id: 3,
        profession: 'Backend Student',
        birthDay: 2003,
      },
    ];
    deepStrictEqual(JSON.stringify(result), JSON.stringify(expected));
  }
})();
