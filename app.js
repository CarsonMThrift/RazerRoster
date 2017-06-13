const RazerRosterApp = {
    init(selectors) {
        //Dictionary to keep all of the images straight
        this.objectArr = [
            { Name: "Razer Blade Pro", Image: "ProductImages/rzrbladepro.png" },
            { Name: "Razer Blade", Image: "ProductImages/rzrblade.jpg" },
            { Name: "Razer Blade Stealth", Image: "ProductImages/rzrbladestealth.jpg" },
            { Name: "Razer Mamba", Image: "ProductImages/rzrmamba.png" },
            { Name: "Razer Lancehead", Image: "ProductImages/rzrlancehead.jpg" },
            { Name: "Jeff Goldblum", Image: "ProductImages/jeffG.jpg" }

        ];

        //array to keep products on so there is a reference to them
        this.productArr = []
        this.max = 0
        this.list = document.querySelector(selectors.listSelector)
        // this.template = document.querySelector(selectors.templateSelector)
        document
            .querySelector(selectors.formSelector)
            .addEventListener('submit', this.addProductViaForm.bind(this))

        this.load()

    },

    getImage(productName) {

        for (i = 0; i < this.objectArr.length; i++) {
            if (this.objectArr[i].Name == productName) {
                console.log(this.objectArr[i].Image)
                return this.objectArr[i].Image
            }
        }
        return "ProductImages/RazerLogoGreen.png"


    },
    addProduct(product) {

        product.image = this.getImage(product.name)

        //add product to kept array
        this.productArr.push(product)
        const listItem = this.renderListItem(product)
        this.list.appendChild(listItem)
        ++this.max

        const buttonList = listItem.childNodes

        buttonList[1].addEventListener('click', this.deleteProduct.bind(this))
        buttonList[2].addEventListener('click', this.favProduct.bind(this))
        buttonList[3].addEventListener('click', this.moveDownProduct.bind(this, product))
        buttonList[4].addEventListener('click', this.moveUpProduct.bind(this, product))

        this.save()

    },

    addProductViaForm(ev) {
        ev.preventDefault()
        const f = ev.target
        console.log(f)
        const product = {
            id: this.max + 1,
            name: f.productName.value,
            // Make fav persist!
            fav: false,
            // TODO: add the type of product to sort by
        }

        this.addProduct(product)

        f.reset()

    },

    save() {
        localStorage
            .setItem('products', JSON.stringify(this.productArr))

    },

    load() {
        // Get the JSON string out of localStorage
        const productsJSON = localStorage.getItem('products')

        // Turn that into an array
        const productsArray = JSON.parse(productsJSON)

        // Set this.flicks to that array
        if (productsArray) {
            productsArray
                .map(this.addProduct.bind(this))
        }

    },

    deleteProduct(ev) {
        ev.preventDefault()
        const m = ev.target.parentElement
        const listItem = m.parentElement
        const index = m.className
        this.productArr.splice(index, 1)

        listItem.outerHTML = ''

    },
    favProduct(ev) {
        ev.preventDefault()
        const m = ev.target.parentElement
        const listItem = m.parentElement

        if (listItem.style.backgroundColor != 'pink') {
            listItem.style.backgroundColor = 'pink'
        } else {
            listItem.style.backgroundColor = 'white'

        }

    },

    moveUpProduct(product, ev) {
        ev.preventDefault()
        const listItem = ev.target.closest('li')

        if (listItem != this.productArr[0]) {
            //Modifying list object
            this.list.insertBefore(listItem, listItem.previousElementSibling)

            //CONSIDER: After second click, the id cannot be read
            //Modifying array to match
            const currentIndex = this.productArr.findIndex((listItem, i) => {
                return listItem.id === product.id
            })

            //Swap the elements
            const toMoveUp = this.productArr[currentIndex]
            this.productArr[currentIndex] = this.productArr[currentIndex - 1]
            this.productArr[currentIndex - 1] = toMoveUp
        }

    },
    moveDownProduct(product, ev) {
        ev.preventDefault()
        const listItem = ev.target.closest('li')

        if (listItem != this.productArr[this.productArr.length - 1]) {

            //Modifying list object
            this.list.insertBefore(listItem.nextSibling, listItem)

            //Modifying array to match
            const currentIndex = this.productArr.findIndex((listItem, i) => {
                return listItem.id === product.id
            })

            //Swap the elements
            const toMoveDown = this.productArr[currentIndex]
            this.productArr[currentIndex] = this.productArr[currentIndex + 1]
            this.productArr[currentIndex + 1] = toMoveDown

        }

    },
    renderListItem(product) {
        const item = document.createElement('li')
        item.className = product.id
        item.textContent = product.name
        item.dataset.id = product.id

        //buttons
        const delButton = document.createElement('button')
        delButton.className = 'deleteButton'
        const favButton = document.createElement('button')
        favButton.className = 'favButton'
        const downButton = document.createElement('button')
        downButton.className = 'downButton'
        const upButton = document.createElement('button')
        upButton.className = 'upButton'

        //icons
        delButton.innerHTML = '<img src="icons/cancel.png" alt="Delete" />'
        favButton.innerHTML = '<img src="icons/heart.png" alt="Favorite" />'
        downButton.innerHTML = '<img src="icons/down-arrow.png" alt="DownArrow" />'
        upButton.innerHTML = '<img src="icons/up-arrow.png" alt="UpArrow" />'


        const imageToApp = document.createElement('img')
        imageToApp.src = product.image
        imageToApp.className = 'prdImage'

        //adding buttons to list item
        item.appendChild(delButton)
        item.appendChild(favButton)
        item.appendChild(downButton)
        item.appendChild(upButton)


        item.appendChild(imageToApp)


        return item
    }
}
RazerRosterApp.init({
    formSelector: '#product-form',
    listSelector: '#product-list',
    //   templateSelector: '.template'
})