# pudgeJS v0.1.4 beta

jQuery-плагин, предназначеный для "выезжающего" меню

## Пример

* demo.html

## Использование

Для блока нужен css
```scss
.myMenu {
	position: fixed;
	z-index: 2;
	left: 0; // для выезжания с права - right: 0;
	top: 0;
	height: 100%;
	width: 260px;
	transform: translate3d(-100%, 0, 0); // для выезжания справа - translate3d(100%, 0, 0)
}

// Для адекватного скролла
.myMenu__scroller {
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	width: 100%;
	overflow-y: auto;
	overflow-x: hidden;
}
```

И JS-файлы плагина *после* библиотеки jQuery:
```html
<script src="js/animit.min.js"></script>
<script src="js/jquery.pudge.min.js"></script>
```

HTML меню
```html
<div class="myMenu">
	<div class="myMenu__scroller">
		<ul class="myMenu__list">
			<li><a href="#">Пунк меню 1</a></li>
			<li><a href="#">Пунк меню 2</a></li>
			<li><a href="#">Пунк меню 3</a></li>
			<li><a href="#">Пунк меню 4</a></li>
			<li><a href="#">Пунк меню 5</a></li>
			<li><a href="#">Пунк меню 6</a></li>
		</ul>
	</div>
</div>
```

И запускайте!
```javascript
$(function() {
	$(".myMenu").pudgeJS({});
});
```

## Опции

### Скорость открытия/закрытия в секундах

```javascript
$(".myMenu").pudgeJS({
	duration: 0.5
});
```
По умолчанию ```0.3```.

### Эффект открытия/закрытия

```javascript
$(".myMenu").pudgeJS({
	timing: "linear"
});
```
По умолчанию ```ease```.

### Класс для overlay

```javascript
$(".myMenu").pudgeJS({
	overlay: "myOverlay"
});
```
По умолчанию ```pudgeJS-overlay```.

### Css для overlay true/false

```javascript
$(".myMenu").pudgeJS({
	overlayCss: false
});
```
По умолчанию ```true```.

### Возможность открытия от края (touch)

```javascript
$(".myMenu").pudgeJS({
	slideToOpen: false // отключенно в iOS из-за нативных событий "history back"
});
```
По умолчанию ```true```.

### Возможность закрытия (touch)

```javascript
$(".myMenu").pudgeJS({
	slideToClose: false
});
```
По умолчанию ```true```.

### Класс обертки сайта (iOS)

```javascript
$(".myMenu").pudgeJS({
	wrapper: ".site-wrapper" // возможность выключить скроллинг документа на iOS
});
```
По умолчанию ```false```.

## Методы

### Open
```javascript
$(".myMenu").pudgeJS("open");
```

### Close
```javascript
$(".myMenu").pudgeJS("close");
```

### Toggle
```javascript
$(".myMenu").pudgeJS("toggle");
```

### Update
```javascript
$(".myMenu").pudgeJS("update", {
	// new opt
});
```

### Destroy
```javascript
$(".myMenu").pudgeJS("destroy");
```

## Совместимость

* IE10+
* Google Chrome
* Firefox
* Надо тестить...