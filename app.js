class App {
  constructor(selectors) {
    this.products = []
    this.max = 0
    this.list = document
      .querySelector(selectors.listSelector)
    this.template = document
      .querySelector(selectors.templateSelector)
    document
      .querySelector(selectors.formSelector)
      .addEventListener('submit', this.addProductViaForm.bind(this))

    this.load()
  }

  load() {
    // Get the JSON string out of localStorage
    const productsJSON = localStorage.getItem('products')

    // Turn that into an array
    const productsArray = JSON.parse(productsJSON)

    // Set this.products to that array
    if (productsArray) {
      productsArray
        .reverse()
        .map(this.addProduct.bind(this))
    }
  }

  addProduct(product) {
    const listItem = this.renderListItem(product)
    this.list
      .insertBefore(listItem, this.list.firstChild)
    
    if (product.id > this.max) {
      this.max = product.id
    }
    this.products.unshift(product)
    this.save()
  }

  addProductViaForm(ev) {
    ev.preventDefault()
    const f = ev.target
    const product = {
      id: this.max + 1,
      name: f.productName.value,
      fav: false,
    }

    this.addProduct(product)

    f.reset()
  }

  save() {
    localStorage
      .setItem('products', JSON.stringify(this.products))

  }

  renderListItem(product) {
    const item = this.template.cloneNode(true)
    item.classList.remove('template')
    item.dataset.id = product.id
    item
      .querySelector('.product-name')
      .textContent = product.name
    item
      .querySelector('.product-name')
      .setAttribute('title', product.name)

    if (product.fav) {
      item.classList.add('fav')
    }

    item
      .querySelector('.product-name')
      .addEventListener('keypress', this.saveOnEnter.bind(this, product))

    item
      .querySelector('button.remove')
      .addEventListener('click', this.removeProduct.bind(this))
    item
      .querySelector('button.fav')
      .addEventListener('click', this.favProduct.bind(this, product))
    item
      .querySelector('button.move-up')
      .addEventListener('click', this.moveUp.bind(this, product))
    item
      .querySelector('button.move-down')
      .addEventListener('click', this.moveDown.bind(this, product))
    item
      .querySelector('button.edit')
      .addEventListener('click', this.edit.bind(this, product))

    return item
  }

  removeProduct(ev) {
    const listItem = ev.target.closest('.product')

    // Find the product in the array, and remove it
    for (let i = 0; i < this.products.length; i++) {
      const currentId = this.products[i].id.toString()
      if (listItem.dataset.id === currentId) {
        this.products.splice(i, 1)
        break
      }
    }

    listItem.remove()
    this.save()
  }

  favProduct(product, ev) {
    console.log(ev.currentTarget)
    const listItem = ev.target.closest('.product')
    product.fav = !product.fav

    if (product.fav) {
      listItem.classList.add('fav')
    } else {
      listItem.classList.remove('fav')
    }
    
    this.save()
  }

  moveUp(product, ev) {
    const listItem = ev.target.closest('.product')

    const index = this.products.findIndex((currentproduct, i) => {
      return currentproduct.id === product.id
    })

    if (index > 0) {
      this.list.insertBefore(listItem, listItem.previousElementSibling)

      const previousproduct = this.products[index - 1]
      this.products[index - 1] = product
      this.products[index] = previousproduct
      this.save()
    }
  }

  moveDown(product, ev) {
    const listItem = ev.target.closest('.product')

    const index = this.products.findIndex((currentproduct, i) => {
      return currentproduct.id === product.id
    })

    if (index < this.products.length - 1) {
      this.list.insertBefore(listItem.nextElementSibling, listItem)
      
      const nextproduct = this.products[index + 1]
      this.products[index + 1] = product
      this.products[index] =  nextproduct
      this.save()
    }
  }

  edit(product, ev) {
    const listItem = ev.target.closest('.product')
    const nameField = listItem.querySelector('.product-name')
    const btn = listItem.querySelector('.edit.button')

    const icon = btn.querySelector('i.fa')

    if (nameField.isContentEditable) {
      // make it no longer editable
      nameField.contentEditable = false
      icon.classList.remove('fa-check')
      icon.classList.add('fa-pencil')
      btn.classList.remove('success')

      // save changes
      product.name = nameField.textContent
      this.save()
    } else {
      nameField.contentEditable = true
      nameField.focus()
      icon.classList.remove('fa-pencil')
      icon.classList.add('fa-check')
      btn.classList.add('success')
    }
  }

  saveOnEnter(product, ev) {
    if (ev.key === 'Enter') {
      this.edit(product, ev)
    }
  }
}

const app = new App({
  formSelector: '#product-form',
  listSelector: '#product-list',
  templateSelector: '.product.template',
})