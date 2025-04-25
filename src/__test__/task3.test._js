import { expect, describe, it, beforeEach, vi } from 'vitest'
import * as fs from 'fs/promises'

// Мокуємо fs/promises перед імпортом основного модуля
vi.mock('fs/promises')

// Імпортуємо функцію після моку
import { deleteFileAsync } from '../main.js'

describe('deleteFileAsync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('успішно видаляє файл', async () => {
    const filename = 'existingFile.txt'
    
    // Встановлюємо мок напряму для fs.unlink
    fs.unlink.mockResolvedValue(undefined)

    await deleteFileAsync(filename)

    expect(fs.unlink).toHaveBeenCalledWith(filename)
    expect(console.log).toHaveBeenCalledWith('Файл успішно видалено')
  })

  it('виводить помилку, коли файл не існує', async () => {
    const filename = 'nonexistentFile.txt'
    const error = new Error('Файл не існує')
    error.code = 'ENOENT'
    
    // Встановлюємо мок для відхилення promise
    fs.unlink.mockRejectedValue(error)

    await deleteFileAsync(filename)

    expect(fs.unlink).toHaveBeenCalledWith(filename)
    expect(console.error).toHaveBeenCalledWith('Файл не існує:', filename)
  })

  it('виводить помилку при інших помилках видалення', async () => {
    const filename = 'problematicFile.txt'
    const error = new Error('Помилка при видаленні')
    
    // Встановлюємо мок для відхилення promise
    fs.unlink.mockRejectedValue(error)

    await deleteFileAsync(filename)

    expect(fs.unlink).toHaveBeenCalledWith(filename)
    expect(console.error).toHaveBeenCalledWith('Помилка при видаленні файлу:', error)
  })
})
