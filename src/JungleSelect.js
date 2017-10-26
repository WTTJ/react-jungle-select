import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { HotKeys } from 'react-hotkeys'
import Immutable from 'immutable'
import onClickOutside from 'react-onclickoutside'
import { remove as removeDiacritics } from 'diacritics'

class JungleSelect extends Component {
  state = {
    filter: '',
    highlighted: null,
    center: true,
    showAll: false,
    listOpened: !this.selectMode(),
    focused: false,
    sortedItems: []
  }

  constructor(props) {
    if (props.limit && props.groups) {
      console.warn("[JungleSelect] Cannot use limit with groups.")
    }
    super(props)
    this.itemElements = []
  }

  handleClickOutside() {
    this.setState({ listOpened: false, filter: '' })
  }

  componentDidMount() {
    const { autofocus, initialFilter, items, groups } = this.props
    this.computeItems(items, groups)
    autofocus && this.focus()
    initialFilter && this.setState({ filter: initialFilter })
  }

  componentWillReceiveProps(nextProps) {
    const { groups, items, initialFilter } = this.props
    if (initialFilter !== nextProps.initialFilter) {
      this.setState({ filter: nextProps.initialFilter })
    }
    if (groups !== nextProps.groups || items !== nextProps.items) {
      this.computeItems(nextProps.items, nextProps.groups)
    }
  }

  computeItems(items, groups) {
    let sortedItems
    if (groups) {
      if (Immutable.List.isList(items)) {
        sortedItems = Immutable.List()
        groups.forEach(group => {
          sortedItems = sortedItems.concat(items.filter(i => i.get('groupId') === group.get('id')))
        })
      } else {
        sortedItems = []
        groups.forEach(group => {
          sortedItems = sortedItems.concat(items.filter(i => i.groupId === group.id))
        })
      }
    } else {
      sortedItems = items
    }
    this.setState({ sortedItems })
  }

  componentDidUpdate(prevProps, prevState) {
    const { highlighted, center } = this.state
    if (this.props.focus !== prevProps.focus) {
      const element = this.filterInput ? this.filterInput : ReactDOM.findDOMNode(this.container)
      if (element) {
        this.props.focus ? this.focus() : this.blur()
      }
    }
    if (center && highlighted !== null && highlighted !== prevState.highlighted) {
      let container = ReactDOM.findDOMNode(this.itemsContainer)
      let element = ReactDOM.findDOMNode(this.itemElements[highlighted])

      if (element && container) {
        let containerHeight = container.offsetHeight
        let elementHeight = element.offsetHeight
        let elementScrollHeight = element.offsetTop - container.offsetTop
        let elementOffsetTop = element.offsetTop - container.offsetTop

        if (elementScrollHeight > (containerHeight - elementHeight)) {
          container.scrollTop = elementScrollHeight - containerHeight + elementHeight
        } else if ((elementOffsetTop) < container.scrollTop) {
          container.scrollTop = elementOffsetTop
        }
      }
    }
  }

  itemAtIndex(index) {
    const { sortedItems } = this.state
    let list = this.filteredItems(sortedItems)
    if (Immutable.List.isList(sortedItems)) {
      return list.get(index)
    } else {
      return list[index]
    }
  }

  indexOfItem(item) {
    const { sortedItems } = this.state
    return this.filteredItems(sortedItems).indexOf(item)
  }

  itemsCount() {
    const { sortedItems } = this.state
    let list = this.filteredItems(sortedItems)
    if (Immutable.List.isList(list)) {
      return list.size
    } else {
      return list.length
    }
  }

  highlightItemFromKeyboard(dir, e) {
    e.preventDefault()
    const { highlighted } = this.state
    let newHighlighted
    if (highlighted != null) {
      switch(dir) {
        case 'next':
          newHighlighted = highlighted + 1
          if (newHighlighted > this.itemsCount() - 1) {
            newHighlighted = 0
          }
          break
        case 'prev':
          newHighlighted = highlighted - 1
          if (newHighlighted < 0) {
            newHighlighted = this.itemsCount() - 1
          }
          break
        default:
          break
      }
    } else {
      newHighlighted = 0
    }
    this.setState({ highlighted: newHighlighted, center: true, listOpened: true })
  }

  highlightItem(item, center = true) {
    this.setState({ highlighted: this.indexOfItem(item), center })
  }

  selectHighlightedItem(e) {
    if (e && (e.key === 'Enter' || e.code === 'Enter')) {
      e.preventDefault()
    }
    const { highlighted } = this.state
    let item = this.itemAtIndex(highlighted)
    this.selectMode() && this.setState({ filter: '' })
    item && this.onChange(item, e)
  }

  selectMode() {
    const { mode } = this.props
    return mode === 'select'
  }

  onChange(item, e) {
    const { onChange } = this.props
    this.selectMode() && this.closeList()
    onChange && onChange(item, e)
  }

  onClear(e) {
    e && e.preventDefault()
    const { onEscape, onFilter, clearable } = this.props
    const { filter, listOpened } = this.state
    let clearClicked = e && e.target && e.target.classList.contains('jungle-select-clear')
    if (
      this.selectMode() &&
      clearable &&
      (
        !listOpened || clearClicked
      )
    ){
      this.onChange(null)
    }
    this.setState({ filter: '', listOpened: !this.selectMode() })
    if (onFilter) { onFilter('') }
    if (onEscape) { onEscape(filter) }
  }

  filter(e) {
    const { onFilter, selectFirstItem } = this.props
    let filter = e.target ? e.target.value : e
    if (onFilter) { onFilter(filter) }
    this.setState({
      filter,
      highlighted: selectFirstItem ? 0 : null,
      listOpened: filter && filter.length
    })
  }

  filteredItems(items) {
    const { filterItem, searchableAttributes } = this.props
    const { filter } = this.state
    let filtered = items
    if (filter.length) {
      if (filterItem) {
        filtered = items.filter(item => filterItem(item, filter))
      } else {
        let search = sanitizeSearchString(filter)
        filtered = items.filter(item => {
          if (typeof(item) === 'string') {
            return sanitizeSearchString(item).indexOf(search) !== -1
          } else if (searchableAttributes) {
            if (Immutable.Map.isMap(item)) {
              if (item.get('filterable') === false) { return true }
              return searchableAttributes.some(k =>
                sanitizeSearchString(item.get(k)).indexOf(search) !== -1
              )
            } else {
              if (item.filterable === false) { return true }
              return searchableAttributes.some(k =>
                sanitizeSearchString(item[k]).indexOf(search) !== -1
              )
            }
          }
          return true
        })
      }
    }
    return filtered
  }

  filteredAndLimitedItems(items) {
    const { limit } = this.props
    const { showAll } = this.state
    const filtered = this.filteredItems(items)
    if (limit && !showAll) {
      return filtered.slice(0, limit)
    } else {
      return filtered
    }
  }

  itemsForGroup(group) {
    const { sortedItems } = this.state
    if (Immutable.List.isList(sortedItems)) {
      return sortedItems.filter(item => item.get('groupId') === group.get('id'))
    } else {
      return sortedItems.filter(item => item.groupId === group.id)
    }
  }

  renderList() {
    const { groups, renderGroup, limit } = this.props
    const { sortedItems } = this.state
    const { showAll } = this.state
    let counter = -1
    if (groups) {
      return groups.map((group, groupIndex) => {
        const groupItems = this.filteredItems(this.itemsForGroup(group))
        return (
          <section
            key={groupIndex}
            className='jungle-select-group'
          >
            <div className='jungle-select-group-title'>{renderGroup(group, groupItems)}</div>
            <div>
              {groupItems.map((item, itemIndex) => {
                counter = counter + 1
                return this.renderInternalItem(item, counter)
              })}
            </div>
          </section>
        )
      })
    } else {
      const limited = this.filteredAndLimitedItems(sortedItems)
      const filtered = this.filteredItems(sortedItems)
      const limitedSize = Immutable.List.isList(limited) ? limited.size : limited.length
      const filteredSize = Immutable.List.isList(filtered) ? filtered.size : filtered.length
      if (!limitedSize) { return null }
      return (
        <div>
          {limited.map((item, itemIndex) => {
            counter = counter + 1
            return this.renderInternalItem(item, counter)
          })}
          {(limitedSize < filteredSize || (showAll && limitedSize > limit )) &&
            this.renderShowAll(showAll, ::this.toggleShowAll)
          }
        </div>
      )
    }
  }

  renderInternalItem(item, index) {
    const selected = this.selectedItems()
    const { highlighted } = this.state
    let classNames = ['jungle-select-item']
    index === highlighted && classNames.push('hover')
    selected.includes(item) && classNames.push('selected')
    return (
      <div
        onClick={this.onChange.bind(this, item)}
        key={index}
        ref={(e) => this.itemElements[index] = e }
        className={classNames.join(' ')}
        onMouseEnter={this.highlightItem.bind(this, item, false)}
        onMouseLeave={highlighted === index ? this.highlightItem.bind(this, null, false) : null}
      >
        {this.renderItem(item, index)}
      </div>
    )
  }

  toggleShowAll() {
    this.setState({ showAll: !this.state.showAll })
  }

  renderShowAll(showAll, onToggle) {
    const { renderShowAll } = this.props
    if (renderShowAll) {
      return renderShowAll(showAll, onToggle)
    } else {
      return (
        <a className='jungle-select-show-all' onClick={onToggle}>
          {showAll ? 'Less' : 'More'}
        </a>
      )
    }
  }

  renderItem(item, index) {
    const { renderItem } = this.props
    if (renderItem) {
      return renderItem(item, index)
    } else {
      return item
    }
  }

  label() {
    const { label } = this.props
    if (label) {
      return <label className='jungle-select-label'>{label}</label>
    } else {
      return null
    }
  }

  clearNode() {
    const { clearNode } = this.props
    return clearNode ? clearNode : '×'
  }

  closeList() {
    this.setState({ listOpened: false, filter: '' })
  }

  toggleList() {
    const { searchable } = this.props
    this.selectMode() && this.state.listOpened && !searchable ? this.blur() : this.focus()
    this.setState({ listOpened: !this.state.listOpened })
  }

  listOpened() {
    if (this.selectMode()) {
      const { searchable } = this.props
      const { listOpened, filter } = this.state
      if (this.itemsCount() === 0) {
        return false
      } else {
        return listOpened || (searchable && filter && filter.length)
      }
    }
    return true
  }

  displayPlaceholderOrValue() {
    const { placeholder }  = this.props
    const selected = this.selectedItems()
    return (
      <div className='jungle-select-selected-values'>
        {selected.length > 0 && this.renderSelectedItems(selected)}
        {selected.length === 0 && placeholder &&
          <div className='jungle-select-placeholder'>{placeholder}</div>
        }
      </div>
    )
  }

  renderSelectedItems(items) {
    const { renderSelectedItem, renderItem } = this.props
    const renderFunction =  renderSelectedItem || renderItem
    return items.map((item, i) =>
      <div
        className='jungle-select-selected-value'
        key={i}
        title={item}
      >
        {renderFunction && renderFunction(item, i)}
        {!renderFunction && item }
      </div>
    )
  }

  selectedItems(items) {
    const { selected } = this.props
    if (!selected) {
      return []
    } else if (Array.isArray(selected)) {
      return selected
    } else {
      return [selected]
    }
  }

  focusableElement() {
    return this.filterInput ? this.filterInput : ReactDOM.findDOMNode(this.container)
  }

  focus() {
    const element = this.focusableElement()
    if (element) {
      element.focus()
      this.onFocusFilter()
    }
  }

  blur() {
    const element = this.focusableElement()
    if (element) {
      element.blur()
      this.onBlurFilter()
    }
  }

  onFocusFilter() {
    const { onFocus } = this.props
    onFocus && onFocus()
    this.setState({ focused: true })
  }

  onBlurFilter() {
    const { onBlur } = this.props
    onBlur && onBlur()
    this.setState({ focused: false })
  }

  render() {
    const keyMap = {
      'up': 'up',
      'down': 'down',
      'enter': ['enter', 'tab', 'shift+tab'],
      'esc': 'esc'
    }
    const handlers = {
      'up': ::this.highlightItemFromKeyboard.bind(this, 'prev'),
      'down': ::this.highlightItemFromKeyboard.bind(this, 'next'),
      'enter': ::this.selectHighlightedItem,
      'esc': ::this.onClear
    }
    const {
      searchable, listWrapper, classList, clearable, mode
    } = this.props
    const { filter, focused } = this.state
    const selected = this.selectedItems()

    let classNames = ['jungle-select']
    this.listOpened() && classNames.push('jungle-select-opened')
    selected.length && classNames.push('jungle-select-selected')
    filter && filter.length && classNames.push('jungle-select-filtered')
    focused && classNames.push('jungle-select-focused')
    if (classList) { classNames = classNames.concat(classList) }
    mode && classNames.push(`mode-${mode}`)

    return (
      <HotKeys
        ref={(e) => this.container = e}
        keyMap={keyMap}
        handlers={handlers}
        focused={true}
        className={classNames.join(' ')}
      >
        <div>

          <div className='jungle-select-controls'>
            {(searchable || this.selectMode()) &&
              <div>
                {this.label()}
                <a
                  className='jungle-select-filter'
                  onClick={::this.toggleList}
                  tabIndex={!searchable ? 0 : -1}
                  onFocus={!searchable && ::this.onFocusFilter}
                  onBlur={!searchable && ::this.onBlurFilter}
                >
                  {this.displayPlaceholderOrValue()}
                  {searchable &&
                    <input
                      ref={(e) => this.filterInput = e }
                      value={filter}
                      onChange={::this.filter}
                      onFocus={::this.onFocusFilter}
                      onBlur={::this.onBlurFilter}
                      autoComplete='off'
                    />
                  }
                </a>
              </div>
            }

            {(filter.length || (selected.length !== 0 && clearable)) &&
              <div
                className='jungle-select-clear'
                onClick={::this.onClear}
              >
                {this.clearNode()}
              </div>
            }
          </div>

          {::this.listOpened() &&
            <div
              className='jungle-select-list'
              ref={(e) => this.itemsContainer = e }
            >
              {listWrapper &&
                listWrapper(this.renderList())
              }
              {!listWrapper &&
                this.renderList()
              }
            </div>
          }

        </div>
      </HotKeys>
    )
  }
}

JungleSelect.PropTypes = {
  mode: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ])
  ).isRequired,
  groups: PropTypes.arrayOf(
    PropTypes.object
  ),
  selected: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
      ])
    )
  ]),
  searchable: PropTypes.bool,
  limit: PropTypes.number,
  searchableAttributes: PropTypes.arrayOf(
    PropTypes.string
  ),
  focus: PropTypes.bool,
  autofocus: PropTypes.bool,
  selectFirstItem: PropTypes.bool,
  initialFilter: PropTypes.string,

  classList: PropTypes.arrayOf(
    PropTypes.string
  ),
  placeholder: PropTypes.string,
  renderItem: PropTypes.func,
  renderGroup: PropTypes.func,
  renderSelectedItem: PropTypes.func,
  renderShowAll: PropTypes.func,
  listWrapper: PropTypes.func,
  clearNode: PropTypes.node,
  label: PropTypes.node,

  onChange: PropTypes.func,
  onFilter: PropTypes.func,
  filterItem: PropTypes.func
}

JungleSelect.defaultProps = {
  mode: 'select',
  searchable: false,
  focus: false,
  autofocus: false,
  selectFirstItem: false,
  selected: []
}

const sanitizeSearchString = (string) =>
  removeDiacritics(string.toLowerCase().replace(/ +(?= )/g,'').trim())

export default onClickOutside(JungleSelect)
