Jungle-Select
============

[React Jungle Select](https://wttj.github.io/react-jungle-select) aims to let you create powerful lists and selects.

Here are some of the main advantages of this library compared to others:

* We use it in production on different projects with various usecases. That's why we wanted it to be **easily and fully customizable**.

* **It's not just a simple "select"**: if you want a **list**, you can get it, with or without **search**, with or without **keyboard navigation**, with or without **groups**, with or without **multiple selections**, and so on.

* It works well with [Redux Form](https://github.com/erikras/redux-form), [react-custom-scrollbars](https://github.com/malte-wessel/react-custom-scrollbars) and other indispensable libraries (see examples below).

* We also provide a **clean DOM**: easy to customize (with or without our example stylesheet).

Give it a try and feel free to [contribute](https://github.com/WTTJ/react-jungle-select/pulls)!

React Jungle Select is made with love by the Welcome to the Jungle Tech team.


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
| `filteringMode` | `string` | | `exact` | filteringMode will allow you to filter results according to the mode you choose ('exact' \| 'every' \| 'any'). 'exact' will return items that match exactly your search string, 'every' will return items that match each word of your search string no matter their order and 'any' will return items that match at least one of the words of your search string (`searchable={true}` only)|
| `searchable` | `bool` | | `false` | Display a filter input or not|
| `searchableAttributes` | `array[string]` | | | Limit your search filter to defined keys if your items are objects |
| `initialFilter` | `string` | | | Initial filter to apply (`searchable={true}` only) |
| `limit` | `number` | | | Limit the number of results of your list to the chosen number (not supported for groups) |
| `focus` | `bool` | | `false` | Allows to handle the focus state of the filter input (`searchable={true}` only) |
| `autofocus` | `bool` | | `false` | Focus state of the filter input on component mount. Deal with `focus` prop to handle the focus state. (`searchable={true}` only) |
| `selectFirstItem` | `bool` | | `false` | Automatically highlights the first matching item on search results |

### Rendering props

| Property | Type | Required | Default | Description |
|:---|:---|:---|:---|:---|
| `classList` | `array[string]` | | | Adds custom classes to the main tag |
| `placeholder` | `string` | | | Represents the placeholder of the search input |
| `renderItem` | `func` | :warning: required if your items are objects | | Lets you customize the items as you need. The item is passed as first argument, the item's index from the items list as second argument and the highlightedItem as third argument|
| `renderGroup` | `func` | :warning: required if you use groups | | Lets you customize the groups as you need. group and matching items are passed as arguments|
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
| `filterItem` | `func` | | | Custom method to filter an item. item and filter is passed as an argument. This method should return a `bool` |


### Highlighting wordings that match with your search string (if `searchable={true}`)
If you want your search filter matches to be highlighted in your search results, just use the highlighted item available as third argument of the `renderItem` prop.
It will wrap the matches in your resulting items with an `<em className='jungle-select-filter-match'></em>` tag.

You can see an example of highlighted search filter matches [here](https://wttj.github.io/react-jungle-select/#highlight-search).

### DOM default structure

```html
<div class="jungle-select jungle-select-opened jungle-select-selected">
  <div class="jungle-select-filter">
    <div class="jungle-select-selected-values">
      <div class="jungle-select-placeholder">Choose an item</div>
      <div class="jungle-select-selected-value">Selected item</div>
    </div>
    <input type="text">
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

Other classes are added to this element to indicate the component's status :

* `.mode-list`, `.mode-select`: The chosen display mode
* `.jungle-select-opened`: the list is opened
* `.jungle-select-selected`: a value has been selected
* `.jungle-select-focused`: the component has focus

JungleSelect's controls are wrapped in a `.jungle-select-controls` tag. It contains the following elements :

* `.jungle-select-filter` which wraps :
  * `.jungle-select-values` which is the tag that wraps each selected values (`.jungle-select-selected-value`) or the placeholder (`.jungle-select-placeholder`) if no value has been selected.
  * the search input
* `.jungle-select-clear` which is used to clear the selected value and filter

The list container has the `.jungle-select-list` class, groups have the `.jungle-select-group` class and items have the `.jungle-select-item` class.


## Styling

A default stylesheet is provided in the library at `dist/JungleSelect.css`. You can use it directly or write your own theme.


## Examples

Our [documentation](https://wttj.github.io/react-jungle-select) contains examples to get started with React Jungle Select


## Develop

To run examples locally in a development server, clone this repo and run:

```
yarn
yarn docs:dev
```

Then open [`localhost:9090`](http://localhost:9090) in a browser.


## Tests

`yarn test`


## Contributing

1. Create an issue and describe your idea
2. [Fork it](https://github.com/WTTJ/react-jungle-select/fork)
3. Create your feature branch (`git checkout -b my-new-feature`)
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Publish the branch (`git push origin my-new-feature`)
6. Create a new Pull Request
