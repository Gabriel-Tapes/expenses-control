import Decimal from 'decimal.js'
import { Gain } from '.'

describe('Entity gain tests', () => {
  it('should be able to create an instance', () => {
    const gain = new Gain({
      ownerId: 'owner',
      value: new Decimal(400)
    })

    expect(gain).toBeInstanceOf(Gain)
    expect(gain.value).toEqual(new Decimal(400))
  })

  it('should not be able to create a gain with negative value', () => {
    expect(() => {
      return new Gain({
        ownerId: 'owner',
        value: new Decimal(-400)
      })
    }).toThrow()
  })

  it('should not be able to set a negative value to value field', () => {
    const gain = new Gain({
      ownerId: 'owner',
      value: new Decimal(400)
    })

    expect(() => {
      gain.value = new Decimal(-400)
    }).toThrow()
  })
})
