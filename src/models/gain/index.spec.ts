import { Gain } from '.'

describe('Entity gain tests', () => {
  it('should be able to create an instance', () => {
    const gain = new Gain({
      ownerId: 'owner',
      value: 400.0
    })

    expect(gain).toBeInstanceOf(Gain)
    expect(gain.value).toBe(400.0)
  })

  it('should not be able to create a gain with negative value', () => {
    expect(() => {
      return new Gain({
        ownerId: 'owner',
        value: -400.0
      })
    }).toThrow()
  })

  it('should not be able to set a negative value to value field', () => {
    const gain = new Gain({
      ownerId: 'owner',
      value: 400.0
    })

    expect(() => {
      gain.value = -400.0
    }).toThrow()
  })
})
