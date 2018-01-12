import React, { Component } from 'react'
import Immutable from 'immutable'
import chai, { expect } from 'chai'
chai.use(require('chai-string'))
import Enzyme, { shallow, mount, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import TestUtils from 'react-dom/test-utils'
import JungleSelect from '../src/index'
import { remove as removeDiacritics } from 'diacritics'

const sanitizeSearchString = (string) =>
  removeDiacritics(string.toLowerCase().replace(/ +(?= )/g,'').trim())

Enzyme.configure({ adapter: new Adapter() })

const listComponent = (overrides) => {
  const props = Object.assign(
    {},
    {
      items: ['foo', 'bar'],
      mode: 'list'
    },
    overrides
  )
  return <JungleSelect {...props} />
}

const selectComponent = (overrides) => {
  const props = Object.assign(
    {},
    {
      items: ['foo', 'bar'],
      mode: 'select'
    },
    overrides
  )
  return <JungleSelect {...props} />
}

describe('JungleSelect', () => {

  describe('mode list:', () => {

    describe('Rendering', () => {

      test('render list of strings', () => {
        const $el = mount(listComponent({
          items: ['foo', 'bar']
        }))
        expect($el.find('.jungle-select-item')).to.have.length(2)
        expect($el.find('.jungle-select-item').first().text()).to.eq('foo')
        expect($el.find('.jungle-select-item').last().text()).to.eq('bar')
      })

      test('render list of integers ', () => {
        const $el = mount(listComponent({
          items: [
            1997,
            1998,
            1999,
            2000
          ],
          searchable: true
        }))
        expect($el.find('.jungle-select-item')).to.have.length(4)
      })

      test('render immutable list of integers ', () => {
        const $el = mount(listComponent({
          items: Immutable.List([
            1997,
            1998,
            1999,
            '2000',
            Immutable.Map({label: 2001}),
            {label: 2002}
          ]),
          searchable: true,
          renderItem: item => JSON.stringify(item)
        }))
        expect($el.find('.jungle-select-item')).to.have.length(6)
      })

      test('render list of objects if renderItem given', () => {
        const $el = mount(listComponent({
          items: [
            { label: 'foo' },
            { label: 'bar' }
          ],
          renderItem: (item) =>
            item.label
        }))
        expect($el.find('.jungle-select-item')).to.have.length(2)
        expect($el.find('.jungle-select-item').first().text()).to.eq('foo')
        expect($el.find('.jungle-select-item').last().text()).to.eq('bar')
      })

      test('render list of immutable objects if renderItem given', () => {
        const $el = mount(listComponent({
          items: Immutable.fromJS([
            { label: 'foo' },
            { label: 'bar' }
          ]),
          renderItem: (item) =>
            item.get('label')
        }))
        expect($el.find('.jungle-select-item')).to.have.length(2)
        expect($el.find('.jungle-select-item').first().text()).to.eq('foo')
        expect($el.find('.jungle-select-item').last().text()).to.eq('bar')
      })

      test('render list of grouped objects if renderItem and renderGroup given', () => {
        const $el = mount(listComponent({
          items: [
            { label: 'foo1', groupId: 'hello' },
            { label: 'foo2', groupId: 'hello' },
            { label: 'bar1', groupId: 'world' },
            { label: 'bar2', groupId: 'world' }
          ],
          groups: [
            { label: 'Hello', id: 'hello'},
            { label: 'World', id: 'world'}
          ],
          renderItem: (item) => {
            return item.label
          },
          renderGroup: (group, items) => {
            return <span className='group'>{group.label} ({items.length})</span>
          }
        }))
        expect($el.find('.jungle-select-group')).to.have.length(2)
        expect($el.find('.jungle-select-item')).to.have.length(4)

        expect($el.find('.jungle-select-group .group').first().text()).to.eq('Hello (2)')
        expect($el.find('.jungle-select-group').first().find('.jungle-select-item').first().text()).to.eq('foo1')
        expect($el.find('.jungle-select-group').first().find('.jungle-select-item').last().text()).to.eq('foo2')

        expect($el.find('.jungle-select-group .group').last().text()).to.eq('World (2)')
        expect($el.find('.jungle-select-group').last().find('.jungle-select-item').first().text()).to.eq('bar1')
        expect($el.find('.jungle-select-group').last().find('.jungle-select-item').last().text()).to.eq('bar2')
      })

      test('render list of grouped immutableobjects if renderItem and renderGroup given', () => {
        const $el = mount(listComponent({
          items: Immutable.fromJS([
            { label: 'foo1', groupId: 'hello' },
            { label: 'foo2', groupId: 'hello' },
            { label: 'bar1', groupId: 'world' },
            { label: 'bar2', groupId: 'world' }
          ]),
          groups: Immutable.fromJS([
            { label: 'Hello', id: 'hello'},
            { label: 'World', id: 'world'}
          ]),
          renderItem: (item) => {
            return item.get('label')
          },
          renderGroup: (group) => {
            return <span className='group'>{group.get('label')}</span>
          }
        }))
        expect($el.find('.jungle-select-group')).to.have.length(2)
        expect($el.find('.jungle-select-item')).to.have.length(4)

        expect($el.find('.jungle-select-group .group').first().text()).to.eq('Hello')
        expect($el.find('.jungle-select-group').first().find('.jungle-select-item').first().text()).to.eq('foo1')
        expect($el.find('.jungle-select-group').first().find('.jungle-select-item').last().text()).to.eq('foo2')

        expect($el.find('.jungle-select-group .group').last().text()).to.eq('World')
        expect($el.find('.jungle-select-group').last().find('.jungle-select-item').first().text()).to.eq('bar1')
        expect($el.find('.jungle-select-group').last().find('.jungle-select-item').last().text()).to.eq('bar2')
      })

      test('allow to wrap list with a custom component', () => {
        const $el = mount(listComponent({
          items: ['foo', 'bar'],
          listWrapper: (list) =>
            <div className='custom-wrapper'>
              {list}
            </div>
        }))
        expect($el.find('.custom-wrapper .jungle-select-item')).to.have.length(2)
        expect($el.find('.custom-wrapper .jungle-select-item').first().text()).to.eq('foo')
        expect($el.find('.custom-wrapper .jungle-select-item').last().text()).to.eq('bar')
      })

      test('allow to add html classes to container', () => {
        const $el = mount(listComponent({
          items: ['foo', 'bar'],
          classList: ['foobar']
        }))
        expect($el.find(JungleSelect).props().classList).to.includes('foobar')
      })

    })

    test('allow to bind click on items', () => {
      const onChangeMock = jest.fn()

      const $el = mount(listComponent({
        items: [
          { label: 'foo1', groupId: 'hello' },
          { label: 'foo2', groupId: 'hello' },
          { label: 'bar1', groupId: 'world' },
          { label: 'bar2', groupId: 'world' }
        ],
        groups: [
          { label: 'Hello', id: 'hello'},
          { label: 'World', id: 'world'}
        ],
        renderItem: (item) => {
          return item.label
        },
        renderGroup: (group) => {
          return group.label
        },
        onChange: onChangeMock,
      }))

      $el.find('.jungle-select-item').first().simulate('click')
      expect(onChangeMock.mock.calls.length).to.eq(1)
      expect(onChangeMock.mock.calls[0][0]).to.deep.eq({ label: 'foo1', groupId: 'hello' })
    })

    describe('Limiting: ', () => {
      test('render limited number of items with a toggle to show all', () => {
        const $el = mount(listComponent({
          items: ['1', '2', '3', '4'],
          limit: 2
        }))

        expect($el.find('.jungle-select-item')).to.have.length(2)
        $el.find('.jungle-select-show-all').first().simulate('click')
        expect($el.find('.jungle-select-item')).to.have.length(4)
        $el.find('.jungle-select-show-all').first().simulate('click')
        expect($el.find('.jungle-select-item')).to.have.length(2)
      })

      test('allow to override showAll component', () => {
        const $el = mount(listComponent({
          items: ['1', '2', '3', '4'],
          limit: 2,
          renderShowAll: (showAll, onToggle) => {
            return (
              <a className='custom-show-all' onClick={onToggle}>
                Toggle
              </a>
            )
          }
        }))

        expect($el.find('.jungle-select-item')).to.have.length(2)
        $el.find('.custom-show-all').first().simulate('click')
        expect($el.find('.jungle-select-item')).to.have.length(4)
        $el.find('.custom-show-all').first().simulate('click')
        expect($el.find('.jungle-select-item')).to.have.length(2)
      })
    })

    describe('Highlighting:', () => {
      test('highlight filter matching wordings from string items with special characters', () => {
        const $el = mount(listComponent({
          items: [
            'Fôö foo',
            'fOò',
            'bar1',
            'bAr2'
          ],
          searchable: true,
          renderItem: (item, index, highlightedItem) => highlightedItem

        }))

        expect($el.find('.jungle-select-item')).to.have.length(4)
        expect($el.find('.jungle-select-item').first().html()).to.have.entriesCount('jungle-select-filter-match', 0)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('jungle-select-filter-match', 0)

        $el.find('.jungle-select-filter input').first().simulate('change', { target: { value: 'foo ' } })
        expect($el.find('.jungle-select-item')).to.have.length(2)
        expect($el.find('.jungle-select-item').first().html()).to.have.entriesCount('jungle-select-filter-match', 2)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('jungle-select-filter-match', 1)

      })

      test('highlight filter matching wordings from string items', () => {
        const $el = mount(listComponent({
          items: [
            'foo1 Foo',
            'foo2',
            'bar1',
            'bar2'
          ],
          searchable: true,
          renderItem: (item, index, highlightedItem) => highlightedItem

        }))

        expect($el.find('.jungle-select-item')).to.have.length(4)
        expect($el.find('.jungle-select-item').first().html()).to.have.entriesCount('jungle-select-filter-match', 0)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('jungle-select-filter-match', 0)

        $el.find('.jungle-select-filter input').first().simulate('change', { target: { value: 'foo ' } })
        expect($el.find('.jungle-select-item')).to.have.length(2)
        expect($el.find('.jungle-select-item').first().html()).to.have.entriesCount('jungle-select-filter-match', 2)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('jungle-select-filter-match', 1)

      })

      test('highlight filter matching wordings from Object items (and dont fail if a searchableAttribute is an Array)', () => {
        const $el = mount(listComponent({
          items: [
            { label: 'foo1 Foo' },
            { label: 'foo2' },
            { label: 'bar1' },
            { label: 'bar2', tags: [1, 2, 3, 4] }
          ],
          renderItem: (item, index, highlightedItem) => {
            return <div><em className='persist'>Foo</em><div>{highlightedItem.label}</div></div>
          },
          searchable: true,
          searchableAttributes: ['label', 'tags']
        }))

        expect($el.find('.jungle-select-item')).to.have.length(4)
        expect($el.find('.jungle-select-item').first().html()).to.have.entriesCount('jungle-select-filter-match', 0)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('jungle-select-filter-match', 0)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('persist', 1)

        $el.find('.jungle-select-filter input').first().simulate('change', { target: { value: 'foo ' } })
        expect($el.find('.jungle-select-item')).to.have.length(2)
        expect($el.find('.jungle-select-item').first().html()).to.have.entriesCount('jungle-select-filter-match', 2)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('jungle-select-filter-match', 1)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('persist', 1)

      })

      test('highlight filter matching wordings from Immutable items', () => {
        const $el = mount(listComponent({
          items: Immutable.fromJS([
            { name: 'foo', label: 'foo1 Foo' },
            { name: 'foo', label: 'foo2' },
            { name: 'foo', label: 'bar1' },
            { name: 'foo', label: 'bar2' }
          ]),
          renderItem: (item, index, highlightedItem) => {
            return <div><em className='persist'>Foo</em><div>{highlightedItem.get('name')}{highlightedItem.get('label')}</div></div>
          },
          searchable: true,
          filteringMode: 'exact',
          searchableAttributes: ['label']
        }))

        expect($el.find('.jungle-select-item')).to.have.length(4)
        expect($el.find('.jungle-select-item').first().html()).to.have.entriesCount('jungle-select-filter-match', 0)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('jungle-select-filter-match', 0)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('persist', 1)

        $el.find('.jungle-select-filter input').first().simulate('change', { target: { value: 'foo ' } })
        expect($el.find('.jungle-select-item')).to.have.length(2)
        expect($el.find('.jungle-select-item').first().html()).to.have.entriesCount('jungle-select-filter-match', 2)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('jungle-select-filter-match', 1)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('persist', 1)

      })

      test('highlight filter matching wordings from Immutable items', () => {
        const $el = mount(listComponent({
          items: Immutable.fromJS([
            { name: 'foo test', label: 'foo1 Foo' }
          ]),
          renderItem: (item, index, highlightedItem) => {
            return <div><em className='persist'>Foo</em><div>{highlightedItem.get('name')}{highlightedItem.get('label')}</div></div>
          },
          searchable: true,
          searchableAttributes: ['name', 'label']
        }))

        expect($el.find('.jungle-select-item')).to.have.length(1)
        expect($el.find('.jungle-select-item').first().html()).to.have.entriesCount('jungle-select-filter-match', 0)

        $el.find('.jungle-select-filter input').first().simulate('change', { target: { value: 'foo ' } })
        expect($el.find('.jungle-select-item')).to.have.length(1)
        expect($el.find('.jungle-select-item').first().html()).to.have.entriesCount('jungle-select-filter-match', 3)

      })

      test('highlight multiple words when searching and using filteringMode prop set to every', () => {
        const $el = mount(listComponent({
          items: [
            { label: 'bar Bar2 foo1 Foo' },
            { label: 'foo2' },
            { label: 'bar1 test foo' },
            { label: 'bar2' }
          ],
          renderItem: (item, index, highlightedItem) => {
            return <div><em className='persist'>Foo</em><div>{highlightedItem.label}</div></div>
          },
          filteringMode: 'every',
          searchable: true,
          searchableAttributes: ['label']
        }))

        expect($el.find('.jungle-select-item')).to.have.length(4)
        expect($el.find('.jungle-select-item').first().html()).to.have.entriesCount('jungle-select-filter-match', 0)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('jungle-select-filter-match', 0)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('persist', 1)

        $el.find('.jungle-select-filter input').first().simulate('change', { target: { value: 'FOo tEst ' } })
        expect($el.find('.jungle-select-item')).to.have.length(1)
        expect($el.find('.jungle-select-item').first().html()).to.have.entriesCount('jungle-select-filter-match', 2)
        expect($el.find('.jungle-select-item').first().html()).to.have.entriesCount('persist', 1)

      })

      test('highlight multiple words when searching and using filteringMode prop set to any', () => {
        const $el = mount(listComponent({
          items: [
            { label: 'bar Bar2 foo1 Foo' },
            { label: 'foo2' },
            { label: 'bar1 test foo' },
            { label: 'bar2' }
          ],
          renderItem: (item, index, highlightedItem) => {
            return <div><em className='persist'>Foo</em><div>{highlightedItem.label}</div></div>
          },
          filteringMode: 'any',
          searchable: true,
          searchableAttributes: ['label']
        }))

        expect($el.find('.jungle-select-item')).to.have.length(4)
        expect($el.find('.jungle-select-item').first().html()).to.have.entriesCount('jungle-select-filter-match', 0)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('jungle-select-filter-match', 0)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('persist', 1)

        $el.find('.jungle-select-filter input').first().simulate('change', { target: { value: 'FOo tEst ' } })
        expect($el.find('.jungle-select-item')).to.have.length(3)
        expect($el.find('.jungle-select-item').first().html()).to.have.entriesCount('jungle-select-filter-match', 2)
        expect($el.find('.jungle-select-item').first().html()).to.have.entriesCount('persist', 1)
        expect($el.find('.jungle-select-item').at(1).html()).to.have.entriesCount('jungle-select-filter-match', 1)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('jungle-select-filter-match', 2)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('persist', 1)

      })

      test('no highlight if using filterItem prop', () => {
        const $el = mount(listComponent({
          items: [
            { label: 'foo1 Foo' },
            { label: 'foo2' },
            { label: 'bar1' },
            { label: 'bar2' }
          ],
          renderItem: (item, index, highlightedItem) => {
            return <div><em className='persist'>Foo</em><div>{highlightedItem.label}</div></div>
          },
          filterItem: (item, filter) =>
            sanitizeSearchString(filter).split(' ').every(s =>
              sanitizeSearchString(item.label).indexOf(s) != -1
            ),
          searchable: true,
          searchableAttributes: ['label']
        }))

        expect($el.find('.jungle-select-item')).to.have.length(4)
        expect($el.find('.jungle-select-item').first().html()).to.have.entriesCount('jungle-select-filter-match', 0)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('jungle-select-filter-match', 0)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('persist', 1)

        $el.find('.jungle-select-filter input').first().simulate('change', { target: { value: 'foo ' } })
        expect($el.find('.jungle-select-item')).to.have.length(2)
        expect($el.find('.jungle-select-item').first().html()).to.have.entriesCount('jungle-select-filter-match', 0)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('jungle-select-filter-match', 0)
        expect($el.find('.jungle-select-item').last().html()).to.have.entriesCount('persist', 1)

      })

    })

    describe('Filtering:', () => {

      test('add an input for search', () => {
        const $notFilterable = mount(listComponent({
          items: [
            'foo1',
            'foo2',
            'bar1',
            'bar2'
          ]
        }))
        expect($notFilterable.find('.jungle-select-filter')).to.have.length(0)
        const $filterable = mount(listComponent({
          items: [
            'foo1',
            'foo2',
            'bar1',
            'bar2'
          ],
          searchable: true
        }))
        expect($filterable.find('.jungle-select-filter')).to.have.length(1)
      })

      test('allow to filter strings', () => {
        const $el = mount(listComponent({
          items: [
            'foo1',
            'foo2',
            'bar1',
            'bar2'
          ],
          searchable: true
        }))
        expect($el.find('.jungle-select-item')).to.have.length(4)
        $el.find('.jungle-select-filter input').first().simulate('change', { target: { value: 'foo' } })
        expect($el.find('.jungle-select-item')).to.have.length(2)
      })

      test('allow to filter item objects if searchableAttributes given', () => {
        const $el = mount(listComponent({
          items: [
            { label: 'foo1' },
            { label: 'foo2' },
            { label: 'bar1' },
            { label: 'bar2' }
          ],
          renderItem: (item) => {
            return item.label
          },
          searchable: true,
          searchableAttributes: ['label']
        }))
        expect($el.find('.jungle-select-item')).to.have.length(4)
        $el.find('.jungle-select-filter input').first().simulate('change', { target: { value: 'foo' } })
        expect($el.find('.jungle-select-item')).to.have.length(2)
      })

      test('allow to filter immutable objects if searchableAttributes given', () => {
        const $el = mount(listComponent({
          items: Immutable.fromJS([
            { label: 'foo1' },
            { label: 'foo2' },
            { label: 'bar1' },
            { label: 'bar2' }
          ]),
          renderItem: (item) => {
            return item.get('label')
          },
          searchable: true,
          searchableAttributes: ['label']
        }))
        expect($el.find('.jungle-select-item')).to.have.length(4)
        $el.find('.jungle-select-filter input').first().simulate('change', { target: { value: 'foo' } })
        expect($el.find('.jungle-select-item')).to.have.length(2)
      })

      test('allow to filter immutable objects an all attributes if searchableAttributes is missing', () => {
        const $el = mount(listComponent({
          items: Immutable.fromJS([
            { label: 'foo1', name: 'bar' },
            { label: 'foo2', name: 'bar' },
            { label: 'bar1', name: 'foo' },
            { label: 'bar2', name: 'bar' }
          ]),
          renderItem: (item) => {
            return item.get('label')
          },
          searchable: true
        }))
        expect($el.find('.jungle-select-item')).to.have.length(4)
        $el.find('.jungle-select-filter input').first().simulate('change', { target: { value: 'foo' } })
        expect($el.find('.jungle-select-item')).to.have.length(3)
      })

      test('allow to filter immutable List containing vanilla objects and immutable maps', () => {
        const $el = mount(listComponent({
          items: Immutable.List([
            { label: 'foo1', name: 'bar' },
            Immutable.Map({ label: 'foo2', name: 'bar' }),
            { label: 'bar1', name: 'foo' },
            Immutable.Map({ label: 'bar2', name: 'bar' })
          ]),
          renderItem: (item) => {
            return Immutable.Map.isMap(item) ? item.get('label') : item.label
          },
          searchable: true
        }))
        expect($el.find('.jungle-select-item')).to.have.length(4)
        $el.find('.jungle-select-filter input').first().simulate('change', { target: { value: 'foo' } })
        expect($el.find('.jungle-select-item')).to.have.length(3)
      })

      test('allow to exclude items from being filtered', () => {
        const $el = mount(listComponent({
          items: [
            { label: 'foo1' },
            { label: 'foo2' },
            { label: 'bar1' },
            { label: 'bar2', filterable: false }
          ],
          renderItem: (item) => {
            return item.label
          },
          searchable: true,
          searchableAttributes: ['label']
        }))
        expect($el.find('.jungle-select-item')).to.have.length(4)
        $el.find('.jungle-select-filter input').first().simulate('change', { target: { value: 'foo' } })
        expect($el.find('.jungle-select-item')).to.have.length(3)
      })

      test('allow to bind method on filter changes', () => {
        const onFilterMock = jest.fn()

        const $el = mount(listComponent({
          items: [
            { label: 'foo1' },
            { label: 'foo2' },
            { label: 'bar1' },
            { label: 'bar2' }
          ],
          renderItem: (item) => {
            return item.label
          },
          searchable: true,
          searchableAttributes: ['label'],
          onFilter: onFilterMock
        }))

        expect(onFilterMock.mock.calls.length).to.eq(0)
        $el.find('.jungle-select-filter input').first().simulate('change', { target: { value: 'foo' } })
        expect(onFilterMock.mock.calls.length).to.eq(1)
        expect(onFilterMock.mock.calls[0][0]).to.eq('foo')
      })

      test('allow to add a label', () => {
        const $el = mount(listComponent({
          items: [
            'foo1',
            'foo2',
            'bar1',
            'bar2'
          ],
          searchable: true,
          label: 'Filter: '
        }))
        expect($el.find('.jungle-select-label')).to.have.length(1)
        expect($el.find('.jungle-select-label').text()).to.eq('Filter: ')
      })

      test('allow to add a placeholder', () => {
        const $el = mount(listComponent({
          items: [
            'foo1',
            'foo2',
            'bar1',
            'bar2'
          ],
          searchable: true,
          placeholder: 'Select your item …'
        }))
        expect($el.find('.jungle-select-placeholder')).to.have.length(1)
        expect($el.find('.jungle-select-placeholder').text()).to.eq('Select your item …')
      })

      test('allow to customize clear element', () => {
        const $el = mount(listComponent({
          items: [
            'foo1',
            'foo2',
            'bar1',
            'bar2'
          ],
          searchable: true,
          clearNode: <div className='custom-clear'>Cancel</div>
        }))
        $el.find('.jungle-select-filter input').first().simulate('change', { target: { value: 'foo' } })
        expect($el.find('.jungle-select-controls .jungle-select-clear > .custom-clear')).to.have.length(1)
        expect($el.find('.jungle-select-controls .jungle-select-clear > .custom-clear').text()).to.eq('Cancel')
      })

      test('allow to pass initial filter', () => {
        const $el = mount(listComponent({
          items: [
            'foo1',
            'foo2',
            'bar1',
            'bar2'
          ],
          searchable: true,
          initialFilter: 'baz'
        }))

        expect($el.find('.jungle-select-filter input').props().value).to.eq('baz')
      })
    })

    describe('Keyboard:', () => {

      test('clear input when hit escape', () => {
        const $el = mount(listComponent({
          items: [
            'foo1',
            'foo2',
            'bar1',
            'bar2'
          ],
          searchable: true
        }))
        $el.find('.jungle-select-filter input').first().simulate('change', { target: { value: 'foo' } })
        expect($el.find('.jungle-select-filter input').props().value).to.eq('foo')
        $el.instance().getInstance().onClear(new Event('keydown'))
        $el.update()
        expect($el.find('.jungle-select-filter input').props().value).to.eq('')
      })

      test('hover next/prev item when hit down/up key', () => {
        const $el = mount(listComponent({
          items: [
            'foo1',
            'foo2',
            'bar1',
            'bar2'
          ],
          searchable: true
        }))
        expect($el.find('.jungle-select-item.hover')).to.have.length(0)
        $el.instance().getInstance().highlightItemFromKeyboard('next', new Event('keydown'))
        $el.update()
        expect($el.find('.jungle-select-filter input').props().value).to.eq('')
        expect($el.find('.jungle-select-item').get(0).props.className).to.contains('hover')
        expect($el.find('.jungle-select-item').get(1).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(2).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(3).props.className).not.to.contains('hover')

        $el.instance().getInstance().highlightItemFromKeyboard('next', new Event('keydown'))
        $el.update()
        expect($el.find('.jungle-select-filter input').props().value).to.eq('')
        expect($el.find('.jungle-select-item').get(0).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(1).props.className).to.contains('hover')
        expect($el.find('.jungle-select-item').get(2).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(3).props.className).not.to.contains('hover')

        $el.instance().getInstance().highlightItemFromKeyboard('next', new Event('keydown'))
        $el.update()
        expect($el.find('.jungle-select-filter input').props().value).to.eq('')
        expect($el.find('.jungle-select-item').get(0).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(1).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(2).props.className).to.contains('hover')
        expect($el.find('.jungle-select-item').get(3).props.className).not.to.contains('hover')

        $el.instance().getInstance().highlightItemFromKeyboard('next', new Event('keydown'))
        $el.update()
        expect($el.find('.jungle-select-filter input').props().value).to.eq('')
        expect($el.find('.jungle-select-item').get(0).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(1).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(2).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(3).props.className).to.contains('hover')

        $el.instance().getInstance().highlightItemFromKeyboard('next', new Event('keydown'))
        $el.update()
        expect($el.find('.jungle-select-filter input').props().value).to.eq('')
        expect($el.find('.jungle-select-item').get(0).props.className).to.contains('hover')
        expect($el.find('.jungle-select-item').get(1).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(2).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(3).props.className).not.to.contains('hover')

        $el.instance().getInstance().highlightItemFromKeyboard('prev', new Event('keydown'))
        $el.update()
        expect($el.find('.jungle-select-filter input').props().value).to.eq('')
        expect($el.find('.jungle-select-item').get(0).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(1).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(2).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(3).props.className).to.contains('hover')
      })

      test('trigger click on selected item when hit enter', () => {
        const onChangeMock = jest.fn()
        const $el = mount(listComponent({
          items: [
            'foo1',
            'foo2',
            'bar1',
            'bar2'
          ],
          onChange: onChangeMock
        }))

        $el.instance().getInstance().highlightItemFromKeyboard('next', new Event('keydown'))
        $el.instance().getInstance().highlightItemFromKeyboard('next', new Event('keydown'))
        $el.update()
        expect($el.find('.jungle-select-item').get(0).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(1).props.className).to.contains('hover')
        expect($el.find('.jungle-select-item').get(2).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(3).props.className).not.to.contains('hover')

        $el.instance().getInstance().selectHighlightedItem(new Event('keydown'))
        $el.update()

        expect(onChangeMock.mock.calls.length).to.eq(1)
        expect(onChangeMock.mock.calls[0][0]).to.eq('foo2')

        $el.instance().getInstance().highlightItemFromKeyboard('next', new Event('keydown'))
        $el.instance().getInstance().selectHighlightedItem(new Event('keydown'))
        $el.update()

        expect(onChangeMock.mock.calls.length).to.eq(2)
        expect(onChangeMock.mock.calls[1][0]).to.eq('bar1')
      })

      test('trigger click on selected immutable item when hit enter', () => {
        const onChangeMock = jest.fn()
        const $el = mount(listComponent({
          items: Immutable.fromJS([
            { label: 'foo1' },
            { label: 'foo2' },
            { label: 'bar1' },
            { label: 'bar2' }
          ]),
          renderItem: (item) => {
            return item.label
          },
          onChange: onChangeMock
        }))

        $el.instance().getInstance().highlightItemFromKeyboard('next', new Event('keydown'))
        $el.instance().getInstance().highlightItemFromKeyboard('next', new Event('keydown'))
        $el.update()
        expect($el.find('.jungle-select-item').get(0).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(1).props.className).to.contains('hover')
        expect($el.find('.jungle-select-item').get(2).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(3).props.className).not.to.contains('hover')

        $el.instance().getInstance().selectHighlightedItem(new Event('keydown'))
        $el.update()

        expect(onChangeMock.mock.calls.length).to.eq(1)
        expect(onChangeMock.mock.calls[0][0].toJS()).to.deep.eq({ label: 'foo2' })

        $el.instance().getInstance().highlightItemFromKeyboard('next', new Event('keydown'))
        $el.instance().getInstance().selectHighlightedItem(new Event('keydown'))
        $el.update()

        expect(onChangeMock.mock.calls.length).to.eq(2)
        expect(onChangeMock.mock.calls[1][0].toJS()).to.deep.eq({ label: 'bar1' })
      })
    })

    describe('Mouse:', () => {

      test('toggle hover on item when MouseEnter/Leave', () => {
        const $el = mount(listComponent({
          items: [
            'foo1',
            'foo2',
            'bar1',
            'bar2'
          ]
        }))

        expect($el.find('.jungle-select-item').get(0).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(1).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(2).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(3).props.className).not.to.contains('hover')

        $el.find('.jungle-select-item').last().simulate('mouseenter')
        expect($el.find('.jungle-select-item').get(0).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(1).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(2).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(3).props.className).to.contains('hover')

        $el.find('.jungle-select-item').first().simulate('mouseenter')
        expect($el.find('.jungle-select-item').get(0).props.className).to.contains('hover')
        expect($el.find('.jungle-select-item').get(1).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(2).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(3).props.className).not.to.contains('hover')

        $el.find('.jungle-select-item').first().simulate('mouseleave')
        expect($el.find('.jungle-select-item').get(0).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(1).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(2).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(3).props.className).not.to.contains('hover')
      })

      test('toggle hover on immutable groups/items when MouseEnter/Leave', () => {
        const $el = mount(listComponent({
          // /!\ Order matters to check items ordering by group is done
          items: Immutable.fromJS([
            { label: 'bar1', groupId: 'bar' },
            { label: 'foo1', groupId: 'foo' },
            { label: 'foo2', groupId: 'foo' },
            { label: 'bar2', groupId: 'bar' }
          ]),
          groups: Immutable.fromJS([
            { label: 'foo', id: 'foo' },
            { label: 'bar', id: 'bar' }
          ]),
          renderItem: (item) => item.get('label'),
          renderGroup: (group) => group.get('label')
        }))

        expect($el.find('.jungle-select-item').get(0).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(1).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(2).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(3).props.className).not.to.contains('hover')

        $el.find('.jungle-select-item').first().simulate('mouseenter')
        expect($el.find('.jungle-select-item').get(0).props.className).to.contains('hover')
        expect($el.find('.jungle-select-item').get(1).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(2).props.className).not.to.contains('hover')
        expect($el.find('.jungle-select-item').get(3).props.className).not.to.contains('hover')
      })
    })

  })

  describe('mode: select', () => {

    describe('Rendering', () => {

      test('render list of strings when opened', () => {
        const $el = mount(selectComponent({
          items: ['foo', 'bar']
        }))
        $el.find('.jungle-select-filter').first().simulate('click')
        expect($el.find('.jungle-select-item')).to.have.length(2)
        expect($el.find('.jungle-select-item').first().text()).to.eq('foo')
        expect($el.find('.jungle-select-item').last().text()).to.eq('bar')
      })

      test('should render show/hide list when click on toggle', () => {
        const $el = mount(selectComponent({
          items: ['foo', 'bar']
        }))
        expect($el.find('.jungle-select-filter').exists()).to.be.true
        expect($el.find('.jungle-select').get(0).props.className).not.to.includes('jungle-select-opened')
        $el.find('.jungle-select-filter').first().simulate('click')
        $el.update()
        expect($el.find('.jungle-select').get(0).props.className).to.includes('jungle-select-opened')
        $el.find('.jungle-select-filter').first().simulate('click')
        $el.update()
        expect($el.find('.jungle-select').get(0).props.className).not.to.includes('jungle-select-opened')
      })

      test('select item on click', () => {
        const onSelectItemMock = jest.fn()
        const $el = mount(selectComponent({
          onChange: onSelectItemMock,
          items: ['foo', 'bar']
        }))
        $el.find('.jungle-select-filter').first().simulate('click')
        expect($el.find('.jungle-select-item')).to.have.length(2)
        $el.find('.jungle-select-item').first().simulate('click')
        expect(onSelectItemMock.mock.calls.length).to.eq(1)
        expect(onSelectItemMock.mock.calls[0][0]).to.eq('foo')
        $el.find('.jungle-select-filter').first().simulate('click')
        $el.find('.jungle-select-item').last().simulate('click')
        expect(onSelectItemMock.mock.calls.length).to.eq(2)
        expect(onSelectItemMock.mock.calls[1][0]).to.eq('bar')
      })

      test('selected item goes in a .jungle-select-selected-value element', () => {
        const onSelectItemMock = jest.fn()
        const $el = mount(selectComponent({
          onChange: onSelectItemMock,
          items: ['foo', 'bar'],
          selected: 'bar'
        }))
        expect($el.find('.jungle-select-selected-values').children()).to.have.length(1)
        expect($el.find('.jungle-select-selected-value')).to.have.length(1)
        expect($el.find('.jungle-select-selected-value').text()).to.eq('bar')
      })

      test('should wrap 3 selected items in 3 elements with .jungle-select-selected-value class', () => {
        const onSelectItemMock = jest.fn()
        const $el = mount(selectComponent({
          onChange: onSelectItemMock,
          items: ['foo', 'bar', 'baz'],
          selected: ['foo', 'bar', 'baz']
        }))
        expect($el.find('.jungle-select-selected-value')).to.have.length(3)
        expect($el.find('.jungle-select-selected-value').first().text()).to.eq('foo')
        expect($el.find('.jungle-select-selected-value').get(1).props.children).to.includes('bar')
        expect($el.find('.jungle-select-selected-value').last().props().children).to.includes('baz')
      })

      test('select item on click', () => {
        const onSelectItemMock = jest.fn()
        const $el = mount(selectComponent({
          onChange: onSelectItemMock,
          items: ['foo', 'bar'],
          selected: 'bar'
        }))
        $el.find('.jungle-select-filter').first().simulate('click')
        expect($el.find('.jungle-select-item.selected')).to.have.length(1)
        expect($el.find('.jungle-select-item.selected').text()).to.eq('bar')
      })

      test('display selected item', () => {
        const $el = mount(selectComponent({
          selected: 'bar',
          items: ['foo', 'bar']
        }))
        expect($el.find('.jungle-select-filter')).to.have.length(1)
        expect($el.find('.jungle-select-filter').text()).to.contain('bar')
      })

      test('should allow to clear item if clearable is true', () => {
        const onSelectItemMock = jest.fn()
        const $el = mount(selectComponent({
          selected: 'bar',
          onChange: onSelectItemMock,
          items: ['foo', 'bar'],
          clearable: true
        }))
        expect($el.find('.jungle-select-clear')).to.have.length(1)
        $el.find('.jungle-select-clear').last().simulate('click')
        expect(onSelectItemMock.mock.calls.length).to.eq(1)
        expect(onSelectItemMock.mock.calls[0][0]).to.eq(null)
      })

      test('should not allow to clear item if clearable is false', () => {
        const onSelectItemMock = jest.fn()
        const $el = mount(selectComponent({
          selected: 'bar',
          onChange: onSelectItemMock,
          items: ['foo', 'bar'],
          clearable: false
        }))
        expect($el.find('.jungle-select-clear')).to.have.length(0)
        $el.instance().getInstance().onClear(new Event('keydown'))
        expect(onSelectItemMock.mock.calls.length).to.eq(0)
      })

      test('should call onFocus after opening list and onBlur after closing', () => {
        const onFocusMock = jest.fn()
        const onBlurMock = jest.fn()
        const $el = mount(selectComponent({
          onFocus: onFocusMock,
          onBlur: onBlurMock,
          items: ['foo', 'bar']
        }))
        $el.find('.jungle-select-filter').first().simulate('click')
        expect(onFocusMock.mock.calls.length).to.eq(1)
        expect(onBlurMock.mock.calls.length).to.eq(0)
        $el.find('.jungle-select-filter').first().simulate('click')
        expect(onBlurMock.mock.calls.length).to.eq(1)
      })

      test('not render clear button if clearable is false', () => {
        const $el = mount(selectComponent({
          clearable: false,
          selected: 'foo',
          listProps: {
            items: ['foo', 'bar']
          }
        }))
        expect($el.find('.jungle-select-clear')).to.have.length(0)
      })

      test('add jungle-select-opened class when filtering', () => {
        const $el = mount(selectComponent({
          listProps: {
            items: ['foo', 'bar']
          },
          searchable: true
        }))
        expect($el.find('.jungle-select.jungle-select-opened').exists()).to.be.false
        $el.find('.jungle-select-filter input').first().simulate('change', { target: { value: 'foo' } })
        $el.update()
        expect($el.find('.jungle-select.jungle-select-opened').exists()).to.be.true
      })

    })

  })

})
