import { Category } from '.'

describe('model category tests', () => {
  it('should be able to create an category', () => {
    const category = new Category({ name: 'food' })

    expect(category).toBeInstanceOf(Category)
    expect(category.name).toBe('food')
  })

  it('should not be able to create an category with blank name', () => {
    expect(() => {
      return new Category({ name: '' })
    }).toThrow()
  })

  it('should not be able to set blank name', () => {
    const category = new Category({ name: 'food' })

    expect(() => {
      category.name = ''
    }).toThrow()
  })
})
