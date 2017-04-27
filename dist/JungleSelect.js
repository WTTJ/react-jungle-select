'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

    var _this = _possibleConstructorReturn(this, (JungleSelect.__proto__ || Object.getPrototypeOf(JungleSelect)).call(this, props));

    _this.state = {
      filter: '',
      highlighted: null,
      center: true,
      showAll: false,
      listOpened: !_this.selectMode(),
      focused: false
    };

    if (props.limit && props.groups) {
      console.warn("[JungleSelect] Cannot use limit with groups.");
    }
    _this.itemElements = [];
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
      this.props.autofocus && this.focus();
      this.props.initialFilter && this.setState({ filter: this.props.initialFilter });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.initialFilter !== nextProps.initialFilter) {
        this.setState({ filter: nextProps.initialFilter });
      }
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
      var items = this.props.items;

      var list = this.filteredItems(items);
      if (_immutable2.default.List.isList(items)) {
        return list.get(index);
      } else {
        return list[index];
      }
    }
  }, {
    key: 'indexOfItem',
    value: function indexOfItem(item) {
      var items = this.props.items;

      return this.filteredItems(items).indexOf(item);
    }
  }, {
    key: 'itemsCount',
    value: function itemsCount() {
      var items = this.props.items;

      var list = this.filteredItems(items);
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
      var _props = this.props,
          onEscape = _props.onEscape,
          onFilter = _props.onFilter,
          clearable = _props.clearable;
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
    key: 'filter',
    value: function filter(e) {
      var _props2 = this.props,
          onFilter = _props2.onFilter,
          selectFirstItem = _props2.selectFirstItem;

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
    key: 'filteredItems',
    value: function filteredItems(items) {
      var _props3 = this.props,
          filterItem = _props3.filterItem,
          searchableAttributes = _props3.searchableAttributes;
      var filter = this.state.filter;

      var filtered = items;
      if (filter.length) {
        if (filterItem) {
          filtered = items.filter(function (item) {
            return filterItem(item, filter);
          });
        } else {
          var search = sanitizeSearchString(filter);
          filtered = items.filter(function (item) {
            if (typeof item === 'string') {
              return sanitizeSearchString(item).indexOf(search) !== -1;
            } else if (searchableAttributes) {
              if (_immutable2.default.Map.isMap(item)) {
                if (item.get('filterable') === false) {
                  return true;
                }
                return searchableAttributes.some(function (k) {
                  return sanitizeSearchString(item.get(k)).indexOf(search) !== -1;
                });
              } else {
                if (item.filterable === false) {
                  return true;
                }
                return searchableAttributes.some(function (k) {
                  return sanitizeSearchString(item[k]).indexOf(search) !== -1;
                });
              }
            }
            return true;
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
      var items = this.props.items;

      if (_immutable2.default.List.isList(items)) {
        return items.filter(function (item) {
          return item.get('groupId') === group.get('id');
        });
      } else {
        return items.filter(function (item) {
          return item.groupId === group.id;
        });
      }
    }
  }, {
    key: 'renderList',
    value: function renderList() {
      var _this2 = this;

      var _props4 = this.props,
          groups = _props4.groups,
          items = _props4.items,
          renderGroup = _props4.renderGroup,
          limit = _props4.limit;
      var showAll = this.state.showAll;

      var counter = -1;
      if (groups) {
        return groups.map(function (group, groupIndex) {
          var groupItems = _this2.filteredItems(_this2.itemsForGroup(group));
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
                return _this2.renderInternalItem(item, counter);
              })
            )
          );
        });
      } else {
        var limited = this.filteredAndLimitedItems(items);
        var filtered = this.filteredItems(items);
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
            return _this2.renderInternalItem(item, counter);
          }),
          (limitedSize < filteredSize || showAll && limitedSize > limit) && this.renderShowAll(showAll, this.toggleShowAll.bind(this))
        );
      }
    }
  }, {
    key: 'renderInternalItem',
    value: function renderInternalItem(item, index) {
      var _this3 = this;

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
            return _this3.itemElements[index] = e;
          },
          className: classNames.join(' '),
          onMouseEnter: this.highlightItem.bind(this, item, false),
          onMouseLeave: highlighted === index && this.highlightItem.bind(this, null, false)
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
    key: 'renderItem',
    value: function renderItem(item, index) {
      var renderItem = this.props.renderItem;

      if (renderItem) {
        return renderItem(item, index);
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
      var _props5 = this.props,
          renderSelectedItem = _props5.renderSelectedItem,
          renderItem = _props5.renderItem;

      var renderFunction = renderSelectedItem || renderItem;
      return items.map(function (item, i) {
        return _react2.default.createElement(
          'div',
          {
            className: 'jungle-select-selected-value',
            key: i,
            title: item
          },
          renderFunction && renderFunction(item, i),
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
          _this4 = this;

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
      var _props6 = this.props,
          searchable = _props6.searchable,
          listWrapper = _props6.listWrapper,
          classList = _props6.classList,
          clearable = _props6.clearable,
          mode = _props6.mode;
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
            return _this4.container = e;
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
                  onFocus: !searchable && this.onFocusFilter.bind(this),
                  onBlur: !searchable && this.onBlurFilter.bind(this)
                },
                this.displayPlaceholderOrValue(),
                searchable && _react2.default.createElement('input', {
                  ref: function ref(e) {
                    return _this4.filterInput = e;
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
                return _this4.itemsContainer = e;
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
  return (0, _diacritics.remove)(string.toLowerCase().replace(/ +(?= )/g, '').trim());
};

exports.default = (0, _reactOnclickoutside2.default)(JungleSelect);