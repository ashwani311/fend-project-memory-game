/*
 * list that holds all of cards classes
 */
const iconList = [

    'fa fa-diamond',

    'fa fa-paper-plane-o',

    'fa fa-anchor',

    'fa fa-bolt',

    'fa fa-cube',

    'fa fa-anchor',

    'fa fa-leaf',

    'fa fa-bicycle',

]

/*
 * Callback function that will flip the card in gameplay
 */
const callbackFunc = function(grid) {

    return function() {

        if (grid.openCards.length <= 1) {

            this.flip()

            this.style.pointerEvents = 'none'

            grid.handleOpen(this)

        }

    }

}


/*
 * Flip Method Added to Card Itself
 */
HTMLLIElement.prototype.flip = function() {

    const classes = this.className.split(" ")

    if (classes[0] === "card") {

        if (classes.length > 1) {

            //Close the card
            this.className = "card"

        } else {

            //Open the card
            this.className = "card open show"

        }

        return true

    }

    return false

}

/*
 * Match Method Added to Card Itself
 */
HTMLLIElement.prototype.match = function() {

    const classes = this.className.split(" ")

    if (classes[0] === "card") {


        this.className = "card match"


        return this.children[0].classList[1]

    }

    return false

}

/*
 * Val Method Added to Card Itself, this will return the val of class
 */
HTMLLIElement.prototype.val = function() {

    const classes = this.className.split(" ")

    if (classes[0] === "card") {

        return this.children[0].classList[1]

    }

    return null

}


/*
 * Star Class, Creates Empty or Filled Star DOM Elements
 */
class Star {

    constructor(empty) {

        this.dom = document.createElement('li')

        const $i = document.createElement('i')

        $i.className = empty ? "fa fa-star-o" : "fa fa-star"

        this.dom.appendChild($i)

    }
}

/*
 * Star List and helper methods used to create and update star rating
 */

class Stars {

    constructor() {

        this.list = document.querySelector(".stars")

        while (this.list.firstChild) {

            this.list.removeChild(this.list.firstChild)

        }

        this.index = 2

        for (let i of [0, 1, 2]) {

            this.list.appendChild(new Star(false).dom)
        }
    }

    removeStar() {

        if (this.index > 0) {

            this.list.removeChild(this.list.children[this.index])

            this.list.appendChild(new Star(true).dom)

            this.index--

                return true

        }

        return false

    }

}

/*
 * Timer class and helper methods to update time when game starts
 */

class Timer {

    constructor() {

        this.resetTimer()

        this.$timeWrapper = document.querySelector('.time')

        this.updateDom()

        this.startTimer()

    }

    clearTimer() {

        if (this.update) {

            clearInterval(this.update)

        }
    }

    startTimer() {

        this.update = setInterval(() => {

            this.updateSeconds()

        }, 1000)
    }

    updateSeconds() {

        this.seconds++

            if (this.seconds >= 60) {

                this.seconds = 0

                this.updateMinutes()
            }

        this.updateDom()
    }

    updateMinutes() {

        this.minutes++

    }

    resetTimer() {

        this.seconds = 0

        this.minutes = 0

    }

    updateDom() {

        this.$timeWrapper.innerHTML = `${this.minutes} : ${this.seconds}`

    }

}



/*
 * Card class to create card dom elements
 */
class Card {

    constructor(className) {

        this.domElement = document.createElement('li')

        this.domElement.className = "card"

        this.$i = document.createElement('i')

        const $style = document.createElement('style')

        this.$i.className = className

        this.domElement.appendChild(this.$i)

    }


}

/*
 * CardGrid class and helper methods define the gameplay and how things will flow in the game
 */


class CardGrid {

    constructor(iconList) {

        this.canvas = document.querySelector('.deck')

        this.list = [...iconList, ...iconList]

        this.makeCanvas()

        this.stars = new Stars()

        this.timer = new Timer()

        this.moves = 0

        this.movesDom = document.querySelector('.moves')

        this.movesDom.innerHTML = 0

        this.matched = 14

        document.querySelector('.restart').addEventListener('click', function(grid) {

            return function() {
                grid.timer.clearTimer()

                new CardGrid(iconList)

            }

        }(this))

        this.modal = document.querySelector('.modal-window')

        this.modal.style.display = "none"

    }

    shuffle() {

        const array = [...this.list]

        let currentIndex = array.length,
            temporaryValue, randomIndex

        while (currentIndex !== 0) {

            randomIndex = Math.floor(Math.random() * currentIndex)

            currentIndex -= 1

            temporaryValue = array[currentIndex]

            array[currentIndex] = array[randomIndex]

            array[randomIndex] = temporaryValue

        }

        this.list = array

    }

    makeCanvas() {

        this.openCards = []

        while (this.canvas.firstChild) {

            this.canvas.removeChild(this.canvas.firstChild)

        }

        this.shuffle()

        for (let className of this.list) {

            const card = new Card(className)

            this.canvas.appendChild(card.domElement)

        }

        this.applyAllClick()

    }


    applyAllClick() {

        for (let card of this.canvas.children) {

            card.addEventListener('click', callbackFunc(this))

        }

    }

    applyClick(card) {

        card.style.pointerEvents = 'auto';

    }

    hideAllClick() {

        this.canvas.style.pointerEvents = "none"

    }

    showAllClick() {

        this.canvas.style.pointerEvents = "auto"

    }

    // Game Play 
    handleOpen(card) {

        this.openCards.push(card)


        if (this.openCards.length === 2) {


            setTimeout(() => {

                if (this.openCards[0].val() === this.openCards[1].val()) {

                    this.openCards[0].match()

                    this.openCards[1].match()

                    this.matched += 2

                } else {

                    for (let openCard of this.openCards) {

                        openCard.flip()

                        this.applyClick(openCard)

                    }

                }


                this.updateMoves()

                this.moves === 10 && this.stars.removeStar() && this.moves === 20 && this.stars.removeStar()

                this.openCards.length = 0

                this.openModal()


            }, 1000)

        }

        this.showAllClick()


    }

    updateMoves() {

        this.movesDom.innerHTML = ++this.moves

    }


    restart(grid) {

        grid.timer

        new CardGrid()
    }


    openModal() {

        console.log(this.matched)

        if (this.matched === 16) {

            this.timer.clearTimer()

            this.modal.style.display = "block"

            document.querySelector('.modal-moves').innerHTML = this.moves

            document.querySelector('.modal-stars').innerHTML = this.stars.list.innerHTML

            document.querySelector('.modal-restart').style.pointerEvents = 'auto'

            document.querySelector('.modal-restart').addEventListener('click', function(grid) {

                console.log("I did work ")

                return function() {

                    console.log("I am working")

                    grid.timer.clearTimer()

                    new CardGrid(iconList)

                }

            }(this))

            document.querySelector('.modal-time').innerHTML = `${this.timer.minutes} : ${this.timer.seconds}`

        }


    }

}

// Start the game by creating a new Object
new CardGrid(iconList)