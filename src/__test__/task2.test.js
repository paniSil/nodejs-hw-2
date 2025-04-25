import { expect, describe, it, beforeEach, vi } from 'vitest'
import * as fs from 'fs/promises'

// Мокуємо fs/promises перед імпортом основного модуля
vi.mock('fs/promises')

// Імпортуємо функцію після моку
import { readFileAsync } from '../main.js'

describe('readFileAsync', () => {
  beforeEach(() => {
    vi.clearAllMocks() // Очищення стану моків перед кожним тестом
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('успішно читає вміст файлу', async () => {
    const filename = 'test.txt'
    const expectedContent = 'Вміст файлу'
    
    // Встановлюємо мок напряму для fs.readFile
    fs.readFile.mockResolvedValue(expectedContent)

    const content = await readFileAsync(filename)

    expect(fs.readFile).toHaveBeenCalledWith(filename, 'utf8')
    expect(console.log).toHaveBeenCalledWith('Файл успішно прочитано:', expectedContent)
    expect(content).toBe(expectedContent)
  })

  it('виводить помилку при виникненні помилок читання файлу', async () => {
    const filename = 'nonexistent.txt'
    const error = new Error('Файл не існує')
    error.code = 'ENOENT'
    
    // Встановлюємо мок для відхилення promise
    fs.readFile.mockRejectedValue(error)

    const content = await readFileAsync(filename)

    expect(fs.readFile).toHaveBeenCalledWith(filename, 'utf8')
    expect(console.error).toHaveBeenCalledWith('Файл не існує:', filename)
    expect(content).toBeNull()
  })

  it('виводить загальну помилку при інших помилках', async () => {
    const filename = 'test.txt'
    const error = new Error('Неочікувана помилка')
    
    // Встановлюємо мок для відхилення promise
    fs.readFile.mockRejectedValue(error)

    const content = await readFileAsync(filename)

    expect(fs.readFile).toHaveBeenCalledWith(filename, 'utf8')
    expect(console.error).toHaveBeenCalledWith('Помилка при читанні файлу:', error)
    expect(content).toBeNull()
  })
})
