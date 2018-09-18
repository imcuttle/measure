/**
 * @file main
 * @author imcuttle
 * @date 2018/4/4
 * @jest-environment node
 */
const nps = require('path')

const psdUtils = require('../lib/psd-utils')

describe('psd-utils', function() {
  it('clr', function() {
    expect(psdUtils.clr('rgb(100,100,200)', 80)).toBe('rgba(100, 100, 200, 0.8)')

    expect(
      psdUtils.clr({
        class: {
          id: 'RGBC'
        },
        'Rd  ': 255,
        'Grn ': 100,
        'Bl  ': 100
      })
    ).toBe('rgb(255, 100, 100)')

    expect(
      psdUtils.clr(
        {
          class: {
            id: 'RGBC'
          },
          'Rd  ': 255,
          'Grn ': 100,
          'Bl  ': 100
        },
        10
      )
    ).toBe('rgba(255, 100, 100, 0.1)')
  })

  it('dropShadowToStyle', function() {
    expect(
      psdUtils.dropShadowToStyle({
        dist: {
          id: '#Pxl',
          value: 5
        },
        angle: 120,
        color: 'rgb(100,0,0)',
        opct: 25,
        spread: 0,
        size: 10
      })
    ).toEqual({
      offsetX: 3,
      offsetY: 4,
      blurRadius: 10,
      spreadRadius: 0,
      color: 'rgba(100, 0, 0, 0.25)'
    })
  })
})
