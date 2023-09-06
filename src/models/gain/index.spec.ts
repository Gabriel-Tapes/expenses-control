import Decimal from 'decimal.js'
import { Gain } from '.'
import { User } from '@/models/user'

describe('Entity gain tests', () => {
  const owner = new User({
    name: 'joe',
    lastName: 'doe',
    email: 'joe.doe@exemple.com',
    password: '12345678'
  })
  it('should be able to create an instance', () => {
    const gain = new Gain({
      owner,
      value: new Decimal(400)
    })

    expect(gain).toBeInstanceOf(Gain)
    expect(gain.value).toEqual(new Decimal(400))
  })

  it('should not be able to create a gain with negative value', () => {
    expect(() => {
      return new Gain({
        owner,
        value: new Decimal(-400)
      })
    }).toThrow()
  })

  it('should not be able to set a negative value to value field', () => {
    const gain = new Gain({
      owner,
      value: new Decimal(400)
    })

    expect(() => {
      gain.value = new Decimal(-400)
    }).toThrow()
  })

  it('should convert to JSON', () => {
    const gain = new Gain({ owner, value: new Decimal(500) })

    expect(gain.toJSON()).toEqual({
      id: gain.id,
      owner: gain.owner.toJSON(),
      value: gain.value,
      createdAt: gain.createdAt.toISOString(),
      updatedAt: gain.updatedAt.toISOString()
    })
  })
})
