# Tooltip

[documentation]: https://ilosey14.github.io/docs/js/tooltip
[example-image]: ./img/example.png

Customizable tooltips and popups for interactive sites.

![tooltip example][example-image]

---

This library offers more customization over an element's default
`title` attribute for interacting with and displaying additional information.

Add a tooltip to any element with the `data-tooltip` attribute.
These can be the names of tooltip templates, or the content itself.
Template commonly used content in a `-tooltip-templates` container.

```html
<!-- Assign tooltips in your content -->
<p data-tooltip="Here I am!">An inline tooltip.</p>
<p data-tooltip="from-template">This one is from a template.</p>

<!-- Include optional templates -->
<div class="-tooltip-templates">
	<span data-name="from-template">Boo! 👻</span>
</div>

<!-- Add `tooltip.html` to the end of your markup -->
<link rel="stylesheet" href="style/tooltip.css">
<div id="tooltip-container">
	<div id="tooltip-content"></div>
</div>
<script src="src/tooltip.js"></script>
```

Additionally, you may wish to pop up content for the user
which should remain visible until dismissed.
Here, we would interact with the library directly to show and close a tooltip.

```javascript
// get the element to display the popup on
var el = document.getElementById('my-element');

// toggle the popup by clicking on the element
el.addEventListener('click', () => {
	if (tooltip.isOpen)
		tooltip.close();
	else
		tooltip(el, 'my-content');
});
```

*Note: opening the tooltip on another element would clear any open content.*
*Set the `onclear` listener to interact with your content before it is changed.*

See the `example.html` for a more detailed implementation and a live demo.

## Documentation and More

Check the [docs][documentation] for everything you can do with this library.

### Clone the repo

```bash
git clone https://github.com/ilosey/tooltip.git
```