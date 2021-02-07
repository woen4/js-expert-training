import { readFile } from 'fs/promises';
import { join } from 'path';
import { error } from './constants';
import User from './user';

const DEFAULT_OPTIONS = {
  maxLines: 3,
  fields: ['id', 'name', 'profession', 'age'],
};

class File {
  static async csvToJson(filePath) {
    const content = await this.getFileContent(filePath);
    const validation = this.isValid(content);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    return this.parseCSVToJSON(content);
  }

  static async getFileContent(filePath) {
    return (await readFile(filePath)).toString('utf-8');
  }

  static isValid(csvString, options = DEFAULT_OPTIONS) {
    const [header, ...contentWithoutHeader] = csvString.split('\n');
    const isHeaderValid = header === options.fields.join(',');

    const isContentLengthAccepted =
      contentWithoutHeader.length > 0 &&
      contentWithoutHeader.length <= options.maxLines;
    if (!isContentLengthAccepted) {
      return {
        error: error.FILE_LENGTH_ERROR_MESSAGE,
        valid: false,
      };
    }

    if (!isHeaderValid) {
      return {
        error: error.FILE_FIELDS_ERROR_MESSAGE,
        valid: false,
      };
    }

    return { valid: true };
  }

  static parseCSVToJSON(csvString) {
    const lines = csvString.split('\n');
    //Removes the first element from an array and returns it.
    const firstLine = lines.shift();
    const header = firstLine.split(',');
    let lastUser = {};
    const users = lines.map((line) => {
      const columns = line.split(',');
      let user = {};
      columns.forEach((property, index) => {
        user = { ...user, [header[index]]: property };
      });
      return new User(user);
    });
    return users;
  }
}

export default File;
