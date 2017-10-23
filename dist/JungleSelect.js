'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactHotkeys = require('react-hotkeys');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactOnclickoutside = require('react-onclickoutside');

var _reactOnclickoutside2 = _interopRequireDefault(_reactOnclickoutside);

var _diacritics = require('diacritics');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var JungleSelect = function (_Component) {
  _inherits(JungleSelect, _Component);

  function JungleSelect(props) {
    _classCallCheck(this, JungleSelect);

    if (props.limit && props.groups) {
      console.warn("[JungleSelect] Cannot use limit with groups.");
    }

    var _this = _possibleConstructorReturn(this, (JungleSelect.__proto__ || Object.getPrototypeOf(JungleSelect)).call(this, props));

    _this.state = {
      filter: '',
      highlighted: null,
      center: true,
      showAll: false,
      listOpened: !_this.selectMode(),
      focused: false,
      sortedItems: []
    };

    _this.itemElements = [];
    _this.highlights = [];
    return _this;
  }

  _createClass(JungleSelect, [{
    key: 'handleClickOutside',
    value: function handleClickOutside() {
      this.setState({ listOpened: false, filter: '' });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          autofocus = _props.autofocus,
          initialFilter = _props.initialFilter,
          items = _props.items,
          groups = _props.groups;

      this.computeItems(items, groups);
      autofocus && this.focus();
      initialFilter && this.setState({ filter: initialFilter });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _props2 = this.props,
          groups = _props2.groups,
          items = _props2.items,
          initialFilter = _props2.initialFilter;

      if (initialFilter !== nextProps.initialFilter) {
        this.setState({ filter: nextProps.initialFilter });
      }
      if (groups !== nextProps.groups || items !== nextProps.items) {
        this.computeItems(nextProps.items, nextProps.groups);
      }
    }
  }, {
    key: 'computeItems',
    value: function computeItems(items, groups) {
      var sortedItems = void 0;
      if (groups) {
        if (_immutable2.default.List.isList(items)) {
          sortedItems = _immutable2.default.List();
          groups.forEach(function (group) {
            sortedItems = sortedItems.concat(items.filter(function (i) {
              return i.get('groupId') === group.get('id');
            }));
          });
        } else {
          sortedItems = [];
          groups.forEach(function (group) {
            sortedItems = sortedItems.concat(items.filter(function (i) {
              return i.groupId === group.id;
            }));
          });
        }
      } else {
        sortedItems = items;
      }
      this.setState({ sortedItems: sortedItems });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var _state = this.state,
          highlighted = _state.highlighted,
          center = _state.center;

      if (this.props.focus !== prevProps.focus) {
        var element = this.filterInput ? this.filterInput : _reactDom2.default.findDOMNode(this.container);
        if (element) {
          this.props.focus ? this.focus() : this.blur();
        }
      }
      if (center && highlighted !== null && highlighted !== prevState.highlighted) {
        var container = _reactDom2.default.findDOMNode(this.itemsContainer);
        var _element = _reactDom2.default.findDOMNode(this.itemElements[highlighted]);

        if (_element && container) {
          var containerHeight = container.offsetHeight;
          var elementHeight = _element.offsetHeight;
          var elementScrollHeight = _element.offsetTop - container.offsetTop;
          var elementOffsetTop = _element.offsetTop - container.offsetTop;

          if (elementScrollHeight > containerHeight - elementHeight) {
            container.scrollTop = elementScrollHeight - containerHeight + elementHeight;
          } else if (elementOffsetTop < container.scrollTop) {
            container.scrollTop = elementOffsetTop;
          }
        }
      }
    }
  }, {
    key: 'itemAtIndex',
    value: function itemAtIndex(index) {
      var sortedItems = this.state.sortedItems;

      var list = this.filteredItems(sortedItems);
      if (_immutable2.default.List.isList(sortedItems)) {
        return list.get(index);
      } else {
        return list[index];
      }
    }
  }, {
    key: 'indexOfItem',
    value: function indexOfItem(item) {
      var sortedItems = this.state.sortedItems;

      return this.filteredItems(sortedItems).indexOf(item);
    }
  }, {
    key: 'originalItemIndex',
    value: function originalItemIndex(item) {
      var sortedItems = this.state.sortedItems;

      if (this.props.groups) {
        return this.itemsForGroup(this.groupFromItem(item)).indexOf(item);
      }
      return sortedItems.indexOf(item);
    }
  }, {
    key: 'groupFromItem',
    value: function groupFromItem(item) {
      var groups = this.props.groups;

      var groupId = _immutable2.default.Map.isMap(item) ? item.get('groupId') : item.groupId;
      return groups.find(function (group) {
        if (_immutable2.default.Map.isMap(group)) {
          return group.get('id') === groupId;
        } else {
          return group.id === groupId;
        }
      });
    }
  }, {
    key: 'itemsCount',
    value: function itemsCount() {
      var sortedItems = this.state.sortedItems;

      var list = this.filteredItems(sortedItems);
      if (_immutable2.default.List.isList(list)) {
        return list.size;
      } else {
        return list.length;
      }
    }
  }, {
    key: 'highlightItemFromKeyboard',
    value: function highlightItemFromKeyboard(dir, e) {
      e.preventDefault();
      var highlighted = this.state.highlighted;

      var newHighlighted = void 0;
      if (highlighted != null) {
        switch (dir) {
          case 'next':
            newHighlighted = highlighted + 1;
            if (newHighlighted > this.itemsCount() - 1) {
              newHighlighted = 0;
            }
            break;
          case 'prev':
            newHighlighted = highlighted - 1;
            if (newHighlighted < 0) {
              newHighlighted = this.itemsCount() - 1;
            }
            break;
          default:
            break;
        }
      } else {
        newHighlighted = 0;
      }
      this.setState({ highlighted: newHighlighted, center: true, listOpened: true });
    }
  }, {
    key: 'highlightItem',
    value: function highlightItem(item) {
      var center = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      this.setState({ highlighted: this.indexOfItem(item), center: center });
    }
  }, {
    key: 'selectHighlightedItem',
    value: function selectHighlightedItem(e) {
      if (e && (e.key === 'Enter' || e.code === 'Enter')) {
        e.preventDefault();
      }
      var highlighted = this.state.highlighted;

      var item = this.itemAtIndex(highlighted);
      this.selectMode() && this.setState({ filter: '' });
      item && this.onChange(item, e);
    }
  }, {
    key: 'selectMode',
    value: function selectMode() {
      var mode = this.props.mode;

      return mode === 'select';
    }
  }, {
    key: 'onChange',
    value: function onChange(item, e) {
      var onChange = this.props.onChange;

      this.selectMode() && this.closeList();
      onChange && onChange(item, e);
    }
  }, {
    key: 'onClear',
    value: function onClear(e) {
      e && e.preventDefault();
      var _props3 = this.props,
          onEscape = _props3.onEscape,
          onFilter = _props3.onFilter,
          clearable = _props3.clearable;
      var _state2 = this.state,
          filter = _state2.filter,
          listOpened = _state2.listOpened;

      var clearClicked = e && e.target && e.target.classList.contains('jungle-select-clear');
      if (this.selectMode() && clearable && (!listOpened || clearClicked)) {
        this.onChange(null);
      }
      this.setState({ filter: '', listOpened: !this.selectMode() });
      if (onFilter) {
        onFilter('');
      }
      if (onEscape) {
        onEscape(filter);
      }
    }
  }, {
    key: 'searchableAttributes',
    value: function searchableAttributes(item) {
      var searchableAttributes = this.props.searchableAttributes;

      if (!searchableAttributes) {
        if (_immutable2.default.Map.isMap(item)) {
          return item.keySeq().toArray();
        } else if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
          return Object.keys(item);
        }
        return [];
      }
      return searchableAttributes;
    }
  }, {
    key: 'filter',
    value: function filter(e) {
      var _props4 = this.props,
          onFilter = _props4.onFilter,
          selectFirstItem = _props4.selectFirstItem;

      var filter = e.target ? e.target.value : e;
      if (onFilter) {
        onFilter(filter);
      }
      this.setState({
        filter: filter,
        highlighted: selectFirstItem ? 0 : null,
        listOpened: filter && filter.length
      });
    }
  }, {
    key: 'filterMethod',
    value: function filterMethod(string) {
      var filteringMode = this.props.filteringMode;
      var filter = this.state.filter;

      var search = sanitizeSearchString(filter);
      switch (filteringMode) {
        case 'any':
          return search.split(' ').some(function (s) {
            return sanitizeSearchString(string).indexOf(s) !== -1;
          });
        case 'every':
          return search.split(' ').every(function (s) {
            return sanitizeSearchString(string).indexOf(s) !== -1;
          });
        default:
          return sanitizeSearchString(string).indexOf(search) !== -1;
      }
    }
  }, {
    key: 'filteredItems',
    value: function filteredItems(items) {
      var _this2 = this;

      var filterItem = this.props.filterItem;
      var filter = this.state.filter;

      var filtered = items;
      this.highlights = _immutable2.default.List(items.map(function (i) {
        if ((typeof i === 'undefined' ? 'undefined' : _typeof(i)) === 'object' && !_immutable2.default.Map.isMap(i)) {
          return _immutable2.default.Map(i);
        }
        return i;
      }));
      if (filter.length) {
        if (filterItem) {
          filtered = items.filter(function (item, index) {
            return filterItem(item, filter);
          });
        } else {
          filtered = items.filter(function (item, index) {
            if (typeof item === 'string') {
              var match = _this2.filterMethod(item);
              if (match) {
                _this2.highlights = _this2.highlights.set(index, _this2.highlightFilterMatches(item));
              }
              return match;
            } else {
              var searchableAttributes = _this2.searchableAttributes(item);
              if (_immutable2.default.Map.isMap(item)) {
                if (item.get('filterable') === false) {
                  return true;
                }
                var matches = item;
                var matching = searchableAttributes.map(function (k) {
                  var match = _this2.filterMethod(item.get(k));
                  if (match) {
                    matches = matches.set(k, _this2.highlightFilterMatches(item.get(k)));
                    _this2.highlights = _this2.highlights.set(index, matches);
                  }
                  return match;
                }).some(function (b) {
                  return b;
                });
                return matching;
              } else {
                if (item.filterable === false) {
                  return true;
                }
                var _matches = _immutable2.default.fromJS(item);
                var _matching = searchableAttributes.map(function (k) {
                  var match = _this2.filterMethod(item[k]);
                  if (match) {
                    _matches = _matches.set(k, _this2.highlightFilterMatches(item[k]));
                    _this2.highlights = _this2.highlights.set(index, _matches);
                  }
                  return match;
                }).some(function (b) {
                  return b;
                });
                return _matching;
              }
            }
          });
        }
      }
      return filtered;
    }
  }, {
    key: 'filteredAndLimitedItems',
    value: function filteredAndLimitedItems(items) {
      var limit = this.props.limit;
      var showAll = this.state.showAll;

      var filtered = this.filteredItems(items);
      if (limit && !showAll) {
        return filtered.slice(0, limit);
      } else {
        return filtered;
      }
    }
  }, {
    key: 'itemsForGroup',
    value: function itemsForGroup(group) {
      var sortedItems = this.state.sortedItems;

      if (_immutable2.default.List.isList(sortedItems)) {
        return sortedItems.filter(function (item) {
          return item.get('groupId') === group.get('id');
        });
      } else {
        return sortedItems.filter(function (item) {
          return item.groupId === group.id;
        });
      }
    }
  }, {
    key: 'renderList',
    value: function renderList() {
      var _this3 = this;

      var _props5 = this.props,
          groups = _props5.groups,
          renderGroup = _props5.renderGroup,
          limit = _props5.limit;
      var sortedItems = this.state.sortedItems;
      var showAll = this.state.showAll;

      var counter = -1;
      if (groups) {
        return groups.map(function (group, groupIndex) {
          var groupItems = _this3.filteredItems(_this3.itemsForGroup(group));
          return _react2.default.createElement(
            'section',
            {
              key: groupIndex,
              className: 'jungle-select-group'
            },
            _react2.default.createElement(
              'div',
              { className: 'jungle-select-group-title' },
              renderGroup(group, groupItems)
            ),
            _react2.default.createElement(
              'div',
              null,
              groupItems.map(function (item, itemIndex) {
                counter = counter + 1;
                return _this3.renderInternalItem(item, counter);
              })
            )
          );
        });
      } else {
        var limited = this.filteredAndLimitedItems(sortedItems);
        var filtered = this.filteredItems(sortedItems);
        var limitedSize = _immutable2.default.List.isList(limited) ? limited.size : limited.length;
        var filteredSize = _immutable2.default.List.isList(filtered) ? filtered.size : filtered.length;
        if (!limitedSize) {
          return null;
        }
        return _react2.default.createElement(
          'div',
          null,
          limited.map(function (item, itemIndex) {
            counter = counter + 1;
            return _this3.renderInternalItem(item, counter);
          }),
          (limitedSize < filteredSize || showAll && limitedSize > limit) && this.renderShowAll(showAll, this.toggleShowAll.bind(this))
        );
      }
    }
  }, {
    key: 'renderInternalItem',
    value: function renderInternalItem(item, index) {
      var _this4 = this;

      var selected = this.selectedItems();
      var highlighted = this.state.highlighted;

      var classNames = ['jungle-select-item'];
      index === highlighted && classNames.push('hover');
      selected.includes(item) && classNames.push('selected');
      return _react2.default.createElement(
        'div',
        {
          onClick: this.onChange.bind(this, item),
          key: index,
          ref: function ref(e) {
            return _this4.itemElements[index] = e;
          },
          className: classNames.join(' '),
          onMouseEnter: this.highlightItem.bind(this, item, false),
          onMouseLeave: highlighted === index ? this.highlightItem.bind(this, null, false) : null
        },
        this.renderItem(item, index)
      );
    }
  }, {
    key: 'toggleShowAll',
    value: function toggleShowAll() {
      this.setState({ showAll: !this.state.showAll });
    }
  }, {
    key: 'renderShowAll',
    value: function renderShowAll(showAll, onToggle) {
      var renderShowAll = this.props.renderShowAll;

      if (renderShowAll) {
        return renderShowAll(showAll, onToggle);
      } else {
        return _react2.default.createElement(
          'a',
          { className: 'jungle-select-show-all', onClick: onToggle },
          showAll ? 'Less' : 'More'
        );
      }
    }
  }, {
    key: 'highlightFilterMatches',
    value: function highlightFilterMatches(text) {
      var filter = this.state.filter;

      var regexedFilter = filter.trim().replace(/[^\w\s]/g, '\\$&').replace(/[\s]+/g, '|');
      if (regexedFilter === '') return text;
      var regex = new RegExp(regexedFilter, 'gi');
      var subst = '<em class=\'jungle-select-filter-match\'>$&</em>';
      return _react2.default.createElement('span', { dangerouslySetInnerHTML: { __html: text.replace(regex, subst) } });
    }
  }, {
    key: 'renderItem',
    value: function renderItem(item, index) {
      var renderItem = this.props.renderItem;

      if (renderItem) {
        var highlightedItem = this.highlights.get(this.originalItemIndex(item));
        if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !_immutable2.default.Map.isMap(item)) {
          highlightedItem = highlightedItem.toJS();
        }
        return renderItem(item, index, highlightedItem);
      } else {
        return item;
      }
    }
  }, {
    key: 'label',
    value: function label() {
      var label = this.props.label;

      if (label) {
        return _react2.default.createElement(
          'label',
          { className: 'jungle-select-label' },
          label
        );
      } else {
        return null;
      }
    }
  }, {
    key: 'clearNode',
    value: function clearNode() {
      var clearNode = this.props.clearNode;

      return clearNode ? clearNode : '×';
    }
  }, {
    key: 'closeList',
    value: function closeList() {
      this.setState({ listOpened: false, filter: '' });
    }
  }, {
    key: 'toggleList',
    value: function toggleList() {
      var searchable = this.props.searchable;

      this.selectMode() && this.state.listOpened && !searchable ? this.blur() : this.focus();
      this.setState({ listOpened: !this.state.listOpened });
    }
  }, {
    key: 'listOpened',
    value: function listOpened() {
      if (this.selectMode()) {
        var searchable = this.props.searchable;
        var _state3 = this.state,
            listOpened = _state3.listOpened,
            filter = _state3.filter;

        if (this.itemsCount() === 0) {
          return false;
        } else {
          return listOpened || searchable && filter && filter.length;
        }
      }
      return true;
    }
  }, {
    key: 'displayPlaceholderOrValue',
    value: function displayPlaceholderOrValue() {
      var placeholder = this.props.placeholder;

      var selected = this.selectedItems();
      return _react2.default.createElement(
        'div',
        { className: 'jungle-select-selected-values' },
        selected.length > 0 && this.renderSelectedItems(selected),
        selected.length === 0 && placeholder && _react2.default.createElement(
          'div',
          { className: 'jungle-select-placeholder' },
          placeholder
        )
      );
    }
  }, {
    key: 'renderSelectedItems',
    value: function renderSelectedItems(items) {
      var _props6 = this.props,
          renderSelectedItem = _props6.renderSelectedItem,
          renderItem = _props6.renderItem;

      var renderFunction = renderSelectedItem || renderItem;
      return items.map(function (item, i) {
        return _react2.default.createElement(
          'div',
          {
            className: 'jungle-select-selected-value',
            key: i,
            title: item
          },
          renderFunction && renderFunction(item, i, item),
          !renderFunction && item
        );
      });
    }
  }, {
    key: 'selectedItems',
    value: function selectedItems(items) {
      var selected = this.props.selected;

      if (!selected) {
        return [];
      } else if (Array.isArray(selected)) {
        return selected;
      } else {
        return [selected];
      }
    }
  }, {
    key: 'focusableElement',
    value: function focusableElement() {
      return this.filterInput ? this.filterInput : _reactDom2.default.findDOMNode(this.container);
    }
  }, {
    key: 'focus',
    value: function focus() {
      var element = this.focusableElement();
      if (element) {
        element.focus();
        this.onFocusFilter();
      }
    }
  }, {
    key: 'blur',
    value: function blur() {
      var element = this.focusableElement();
      if (element) {
        element.blur();
        this.onBlurFilter();
      }
    }
  }, {
    key: 'onFocusFilter',
    value: function onFocusFilter() {
      var onFocus = this.props.onFocus;

      onFocus && onFocus();
      this.setState({ focused: true });
    }
  }, {
    key: 'onBlurFilter',
    value: function onBlurFilter() {
      var onBlur = this.props.onBlur;

      onBlur && onBlur();
      this.setState({ focused: false });
    }
  }, {
    key: 'render',
    value: function render() {
      var _context,
          _this5 = this;

      var keyMap = {
        'up': 'up',
        'down': 'down',
        'enter': ['enter', 'tab', 'shift+tab'],
        'esc': 'esc'
      };
      var handlers = {
        'up': (_context = this.highlightItemFromKeyboard).bind.call(_context, this, 'prev'),
        'down': (_context = this.highlightItemFromKeyboard).bind.call(_context, this, 'next'),
        'enter': this.selectHighlightedItem.bind(this),
        'esc': this.onClear.bind(this)
      };
      var _props7 = this.props,
          searchable = _props7.searchable,
          listWrapper = _props7.listWrapper,
          classList = _props7.classList,
          clearable = _props7.clearable,
          mode = _props7.mode;
      var _state4 = this.state,
          filter = _state4.filter,
          focused = _state4.focused;

      var selected = this.selectedItems();

      var classNames = ['jungle-select'];
      this.listOpened() && classNames.push('jungle-select-opened');
      selected.length && classNames.push('jungle-select-selected');
      filter && filter.length && classNames.push('jungle-select-filtered');
      focused && classNames.push('jungle-select-focused');
      if (classList) {
        classNames = classNames.concat(classList);
      }
      mode && classNames.push('mode-' + mode);

      return _react2.default.createElement(
        _reactHotkeys.HotKeys,
        {
          ref: function ref(e) {
            return _this5.container = e;
          },
          keyMap: keyMap,
          handlers: handlers,
          focused: true,
          className: classNames.join(' ')
        },
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(
            'div',
            { className: 'jungle-select-controls' },
            (searchable || this.selectMode()) && _react2.default.createElement(
              'div',
              null,
              this.label(),
              _react2.default.createElement(
                'a',
                {
                  className: 'jungle-select-filter',
                  onClick: this.toggleList.bind(this),
                  tabIndex: !searchable ? 0 : -1,
                  onFocus: !searchable ? this.onFocusFilter.bind(this) : null,
                  onBlur: !searchable ? this.onBlurFilter.bind(this) : null
                },
                this.displayPlaceholderOrValue(),
                searchable && _react2.default.createElement('input', {
                  ref: function ref(e) {
                    return _this5.filterInput = e;
                  },
                  value: filter,
                  onChange: this.filter.bind(this),
                  onFocus: this.onFocusFilter.bind(this),
                  onBlur: this.onBlurFilter.bind(this),
                  autoComplete: 'off'
                })
              )
            ),
            (filter.length || selected.length !== 0 && clearable) && _react2.default.createElement(
              'div',
              {
                className: 'jungle-select-clear',
                onClick: this.onClear.bind(this)
              },
              this.clearNode()
            )
          ),
          this.listOpened.call(this) && _react2.default.createElement(
            'div',
            {
              className: 'jungle-select-list',
              ref: function ref(e) {
                return _this5.itemsContainer = e;
              }
            },
            listWrapper && listWrapper(this.renderList()),
            !listWrapper && this.renderList()
          )
        )
      );
    }
  }]);

  return JungleSelect;
}(_react.Component);

JungleSelect.PropTypes = {
  mode: _propTypes2.default.bool,
  items: _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object])).isRequired,
  groups: _propTypes2.default.arrayOf(_propTypes2.default.object),
  selected: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object, _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.object]))]),
  filteringMode: _propTypes2.default.string,
  searchable: _propTypes2.default.bool,
  limit: _propTypes2.default.number,
  searchableAttributes: _propTypes2.default.arrayOf(_propTypes2.default.string),
  focus: _propTypes2.default.bool,
  autofocus: _propTypes2.default.bool,
  selectFirstItem: _propTypes2.default.bool,
  initialFilter: _propTypes2.default.string,

  classList: _propTypes2.default.arrayOf(_propTypes2.default.string),
  placeholder: _propTypes2.default.string,
  renderItem: _propTypes2.default.func,
  renderGroup: _propTypes2.default.func,
  renderSelectedItem: _propTypes2.default.func,
  renderShowAll: _propTypes2.default.func,
  listWrapper: _propTypes2.default.func,
  clearNode: _propTypes2.default.node,
  label: _propTypes2.default.node,

  onChange: _propTypes2.default.func,
  onFilter: _propTypes2.default.func,
  filterItem: _propTypes2.default.func
};

JungleSelect.defaultProps = {
  mode: 'select',
  searchable: false,
  focus: false,
  autofocus: false,
  selectFirstItem: false,
  selected: []
};

var sanitizeSearchString = function sanitizeSearchString(string) {
  if (typeof string !== 'string') {
    return '';
  }
  return (0, _diacritics.remove)(string.toLowerCase().replace(/ +(?= )/g, '').trim());
};

exports.default = (0, _reactOnclickoutside2.default)(JungleSelect);