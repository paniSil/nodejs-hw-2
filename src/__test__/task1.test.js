import { expect, describe, it, beforeEach, vi } from 'vitest';
import * as fs from 'fs/promises';

// Мокуємо fs/promises перед імпортом основного модуля
vi.mock('fs/promises');

// Імпортуємо функцію після моку
import { writeFileAsync } from '../main.js';

describe('writeFileAsync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('успішно записує вміст у файл', async () => {
    const filename = 'test.txt';
    const content = 'Тестовий контент';
    
    // Встановлюємо мок напряму для fs.writeFile
    fs.writeFile.mockResolvedValue(undefined);

    await writeFileAsync(filename, content);

    expect(fs.writeFile).toHaveBeenCalledWith(filename, content);
    expect(console.log).toHaveBeenCalledWith('Файл успішно записано');
  });

  it('виводить помилку при виникненні помилок запису', async () => {
    const filename = 'test.txt';
    const content = 'Тестовий контент';
    const error = new Error('Помилка запису');
    
    // Встановлюємо мок для відхилення promise
    fs.writeFile.mockRejectedValue(error);

    const result = await writeFileAsync(filename, content);

    expect(fs.writeFile).toHaveBeenCalledWith(filename, content);
    expect(result).toBe(error);
    expect(console.error).toHaveBeenCalledWith('Помилка при записі файлу:', error);
  });
});
