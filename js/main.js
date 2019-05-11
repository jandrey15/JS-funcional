const compose = (...functions) => data =>
  functions.reduceRight((value, func) => func(value), data)

/*
----- Function Composition ------
const tag = t => content => `<${t}>${content}</${t}>`
console.log(tag('h1')('Title')) // <h1>Title</h1>
*/

const attrsToString = (obj = {}) => {
  const keys = Object.keys(obj) // Devuelve un array -> ["class", "id"]
  const attrs = []
  // console.log(keys)

  for (let i = 0; i < keys.length; i++) {
    let attr = keys[i]
    // console.log(attr) // Devuelve el key de cada object class, id
    attrs.push(`${attr}="${obj[attr]}"`)
  }

  const string = attrs.join(' ') // Unimos el array para obtener = "class="title" id="hello""

  return string
}

// attrsToString({class: 'title', id: 'hello' })

/* 
  tag: 'h1',
  attr: {
    class: 'title',
    id: 'title-id'
  }
*/

const tagAttrs = obj => (content = '') =>
  `<${obj.tag}${obj.attrs ? ' ' :	 ''}${attrsToString(obj.attrs)}>${content}</${obj.tag}>`
/*
  console.log(tagAttrs({
    tag: 'h1',
    attrs: {
      class: 'title',
      id: 'title-id'
    }
  })('Title content'))
  // Result = <h1 class="title" id="title-id">Title content</h1>
*/

const tag = t => {
  if(typeof t === 'string') {
    return tagAttrs({ tag: t })
  }
  return tagAttrs(t)
}

const trashIcon = tag({tag: 'i', attrs: {class: 'fas fa-trash-alt'}})('')

const tableRowTag = tag('tr')
const tableRow = items => tableRowTag(tableCells(items))
// const tableRow = items => compose(tableRowTag, tableCells)(items) // Es lo mismo que lo UP

const tableCell = tag('td')
// console.log(tableCell)
const tableCells = items => items.map(tableCell).join('')
/* 
Es lo mismo que lo de up 
const tableCells = items => items.map(function (data) {
  return tableCell(data)
}).join('')
 */


const description = $('#description')
const calories = $('#calories')
const carbs = $('#carbs')
const protein = $('#protein')

/* let list = [{
  description: 'Manzana',
  calories: 10,
  carbs: 20,
  protein: 50
}] */
let list = []

description.keypress(() => {
  description.removeClass('is-invalid')
})

calories.keypress(() => {
  calories.removeClass('is-invalid')
})

carbs.keypress(() => {
  carbs.removeClass('is-invalid')
})

protein.keypress(() => {
  protein.removeClass('is-invalid')
})

const validateInputs = () => {

  description.val() ? '' : description.addClass('is-invalid')
  calories.val() ? '' : calories.addClass('is-invalid')
  carbs.val() ? '' : carbs.addClass('is-invalid')
  protein.val() ? '' : protein.addClass('is-invalid')

  if(
    description.val() &&
    calories.val() &&
    carbs.val() &&
    protein.val()
  ) add()
}

const add = () => {
  const newItem = {
    description: description.val(),
    calories: parseInt(calories.val()),
    carbs: parseInt(carbs.val()),
    protein: parseInt(protein.val())
  }

  list.push(newItem)
  updateTotals()
  cleanInputs()
  renderItems()
  // console.log(list)
}

const updateTotals = () => {
  let calories = 0, carbs = 0, protein = 0

  list.map(item => {
    calories += item.calories,
    carbs += item.carbs,
    protein += item.protein
  })

  $('#totalCalories').text(calories)
  $('#totalCarbs').text(carbs)
  $('#totalProtein').text(protein)
}

const removeItem = (index) => {
  list.splice(index, 1)

  updateTotals()
  renderItems()
}

const cleanInputs = () => {
  description.val('')
  calories.val('')
  carbs.val('')
  protein.val('')
}

const renderItems = () => {
  $('tbody').empty()

  list.map((item, index) => {

    const removeButton = tag({
      tag: 'button',
      attrs: {
        class: 'btn btn-outline-danger',
        onclick: `removeItem(${index})`
      }
    })(trashIcon)

    $('tbody').append(tableRow([item.description, item.calories, item.carbs, item.protein, removeButton]))
  })
}
