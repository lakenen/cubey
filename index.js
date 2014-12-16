(function () {
  var rAF = window.requestAnimationFrame.bind(window)
    , cAF = window.cancelAnimationFrame.bind(window)
    , TWO_PI = Math.PI * 2

  function Cubey(el) {
    this.el = el
    this.x = this.y = 0
    setupDOM(this.el)
    this.bindEvents()
    this.cube = this.el.querySelector('.cube')
    this.loop = this.loop.bind(this)
    this.loop()
    this.search()
  }

  function bindEvent(el, type, fn) {
    el.addEventListener(type, fn, false)
  }
  function unbindEvent(el, type, fn) {
    el.removeEventListener(type, fn)
  }

  function setupDOM(el) {
    el.innerHTML =
      '<div class="cube">' +
        '<div class="side back"></div>' +
        '<div class="side left"></div>' +
        '<div class="side right"></div>' +
        '<div class="side bottom"></div>' +
        '<div class="side top"></div>' +
        '<div class="side front">' +
          '<div class="face"></div>' +
        '</div>' +
      '</div>'
  }

  Cubey.prototype.draw = function () {
    var ry = -(this.w / 2 - this.x) / TWO_PI
      , rx = (this.h / 2 - this.y) / TWO_PI
    this.cube.style.transform = 'scale(' + this.s + ') rotateY(' + ry + 'deg) rotateX(' + rx + 'deg)'
  }

  Cubey.prototype.update = function () {
    this.w = this.el.clientWidth
    this.h = this.el.clientHeight
    this.s = Math.min(this.w / 200, this.h / 200) / 4
  }

  Cubey.prototype.loop = function () {
    this.update()
    this.draw()
    this.frameId = rAF(this.loop)
  }

  Cubey.prototype.search = function () {
    this.stopSearching()
    this.searchingTID = setTimeout(function () {
      this.x = Math.floor(Math.random() * this.w)
      this.y = Math.floor(Math.random() * this.h)
      this.search()
    }.bind(this), 500 + Math.floor(Math.random() * 1500))
  }

  Cubey.prototype.stopSearching = function () {
    clearTimeout(this.searchingTID)
  }

  Cubey.prototype.destroy = function () {
    cAF(this.frameId)
    this.stopSearching()
    this.unbindEvents()
    this.el.innerHTML = ''
  }

  Cubey.prototype.bindEvents = function() {
    this.handlers = [
        [this.el, 'mousemove', this.handleMouseMove.bind(this)]
      , [this.el, 'mouseenter', this.handleMouseEnter.bind(this)]
      , [this.el, 'mouseleave', this.handleMouseLeave.bind(this)]
    ]
    this.handlers.forEach(function (args) {
      bindEvent.apply(null, args)
    })
  }

  Cubey.prototype.unbindEvents = function () {
    this.handlers.forEach(function (args) {
      bindEvent.apply(null, args)
    })
  }

  Cubey.prototype.handleMouseMove = function (event) {
    this.x = event.clientX - this.el.offsetLeft
    this.y = event.clientY - this.el.offsetTop
    this.stopSearching()
  }

  Cubey.prototype.handleMouseEnter = function (event) {
    this.el.classList.add('active')
    this.stopSearching()
  }

  Cubey.prototype.handleMouseLeave = function (event) {
    this.el.classList.remove('active')
    this.search()
  }

  window.Cubey = Cubey
})()
