Jungle-Select
============


## Installation

with npm :
```
npm install react-jungle-select --save
```

with yarn :
```
yarn add react-jungle-select
```

## Usage

`react-jungle-select` has 2 display modes, `list` and `select`.

`list` mode is useful when you want to have full control on the UI to open
your list.

`select` mode offers a customizable select that can be customized through styles.


### Core props

| Property | Type | Required | Default | Description |
|:---|:---|:---|:---|:---|
| `mode` | `bool` | ✓ | `select` | Display mode. `select` or `list` |
| `items` | `array[string⎮object]` | ✓ | | The items of your list. Can be an array of strings or objects |
| `groups` | `array[object]` | | | Group your items |
| `selected` | `string⎮object⎮object` | In `select` mode | | The selected item(s) |
| `searchable` | `bool` | | `false` | Display a filter input or not|
| `searchableAttributes` | `array[string]` | | | Limit your search filter to defined keys if your items are objects |
| `initialFilter` | `string` | | | Initial filter to apply (`searchable={true}` only) |
| `limit` | `number` | | | Limit the number of results of your list to the chosen number (not supported for groups) |
| `focus` | `bool` | | `false` | Allows to handle the focus state of the filter input. (`searchable={true}` only) |
| `autofocus` | `bool` | | `false` | Focus state of the filter input on component mount. Deal with `focus` prop to handle the focus state. (`searchable={true}` only) |
| `selectFirstItem` | `bool` | | `false` | Automatically highlights the first matching item on search results |

### Rendering props

| Property | Type | Required | Default | Description |
|:---|:---|:---|:---|:---|
| `classList` | `array[string]` | | | Adds custom classes to the main tag |
| `placeholder` | `string` | | | Represents the placeholder of the search input |
| `renderItem` | `func` | :warning: required if your items are objects | | Lets you customize the items as you need. item is passed as an argument|
| `renderGroup` | `func` | :warning: required if you use groups | | Lets you customize the groups as you need. group is passed as an argument|
| `renderSelectedItem` | `func` | | | Lets you customize the selected item. item is passed as an argument |
| `clearNode` | `node` | | `×` | Lets you customize the button that clears the selected value |
| `label` | `node` | | | Adds a label for your jungle-select |
| `renderShowAll` | `func` | | | Lets you customize the 'More / Less' button. It takes 2 arguments, a boolean indicating if the list is expanded or not, and the callback to toggle expand status |
| `listWrapper` | `func` | | | Adds a wrapper tag around your list items (`.jungle-select-item`) or around your groups if you use groups (`.jungle-select-group`). The items or group nodes are passed as an argument. It can be used to add a [CSSTransitionGroup](https://github.com/reactjs/react-transition-group#high-level-api-csstransitiongroup) element to animate the opening list. |

### Callbacks props

| Property | Type | Required | Default | Description |
|:---|:---|:---|:---|:---|
| `onChange` | `func` | | | Called whenever the user clicks or selects an item with the keyboard. item is passed as an argument |
| `onFilter` | `func` | | | Called whenever filter occurs. filter is passed as an argument |
| `filterItem` | `func` | | | Custom method to filter an item. item and filter is passed as an argument. This method shjould return a `bool` |


### DOM default structure

```html
<div class="jungle-select jungle-select-opened jungle-select-selected">
  <div class="jungle-select-filter">
    <input type="text" value="Item" placeholder="Choose an item">
    <div class="jungle-select-clear">×</div>
  </div>
  <div class="jungle-select-list">
    <div>
      <div class="jungle-select-item">Item #1</div>
      <div class="jungle-select-item">Item #2</div>
      <div class="jungle-select-item">Item #3</div>
      […]
    </div>
  </div>
</div>
```

The parent class is `.jungle-select`.

Others classes are added to this element to indicate the component's status :

* `.mode-list`, `.mode-select`: The chosen display mode
* `.jungle-select-opened`: The list is opened
* `.jungle-select-selected`: A value has been selected
* `.jungle-select-focused`: Component has focus

JungleSelect's controls are wrapped in a `.jungle-select-controls` tag. It contains the following elements :

* `.jungle-select-filter` which wraps the search input, the selected value or the placeholder
* `.jungle-select-clear` which is used to clear the selected value and filter

The list container has the `.jungle-select-list` class, groups have the `.jungle-select-group` class and items have the `.jungle-select-item` class.


## Styling

A default stylesheet is provided in the library at `dist/JungleSelect.css`. You can use it directly or write your own theme.


## Examples

FIXME links to examples


## Develop

To run examples locally in a development server, clone this repo and run:

```
yarn
yarn docs:dev
```

Then open [`localhost:9090`](http://localhost:9090) in a browser.
