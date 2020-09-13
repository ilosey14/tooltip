/**
 * Displays a tooltip on the specified element.
 * @param {HTMLElement} element Tooltip element
 * @param {string|HTMLElement} content Tooltip content
 */
const tooltip = function (element, content) {
	if (tooltip.isOpen)
		tooltip.clear();

	if (typeof tooltip.onopen === 'function')
		tooltip.onopen();

	// set contents
	if (typeof content === 'string') {
		if (content in tooltip.templates)
			tooltip.content.appendChild(tooltip.templates[content]);
		else
			tooltip.content.append(content);
	}
	else if (content instanceof HTMLElement)
		tooltip.content.appendChild(content);

	// traverse element's offset position
	var top = tooltip.arrowPadding,
		left = element.offsetWidth / 2,
		offsetParent = element;

	do {
		top += offsetParent.offsetTop;
		left += offsetParent.offsetLeft;
	}
	while (offsetParent = offsetParent.offsetParent);

	// adjust position via rendered contents
	window.setTimeout(() => {
		top -= tooltip.container.offsetHeight;
		left -= tooltip.container.offsetWidth / 2;

		// check for page overflow

		// if the container is above the top of the page,
		// flip arrow to the top and position under element
		if (top < 0) {
			top += element.offsetHeight + tooltip.container.offsetHeight - 2 * tooltip.arrowPadding;
			tooltip.container.classList.add('under');
		}

		// if the container is horizontally off the page,
		// shift contents into the viewport
		// and align the arrow position centered on the element, if possible
		if (left < 0) {
			// adjust back to element center
			left += tooltip.container.offsetWidth / 2 - tooltip.arrowPadding;

			if (left < 0)
				left = 0;

			tooltip.container.classList.add('left');
		}
		else if (left + tooltip.content.offsetWidth > window.innerWidth) {
			// adjust back to center
			left -= tooltip.content.offsetWidth / 2 - tooltip.arrowPadding;

			if (left + tooltip.content.offsetWidth > window.innerWidth)
				left = window.innerWidth - tooltip.content.offsetWidth;

			tooltip.container.classList.add('right');
		}

		// set position
		tooltip.container.style.top = `${top}px`;
		tooltip.container.style.left = `${left}px`;

		// show
		tooltip.container.classList.add('show');
		tooltip.isOpen = true;
	});
};

tooltip.container = document.getElementById('tooltip-container');
tooltip.content   = document.getElementById('tooltip-content');

tooltip.onopen = undefined;
tooltip.onclear = undefined;
tooltip.onclose = undefined;

tooltip.arrowPadding = parseInt(getComputedStyle(tooltip.container, ':after').borderWidth);
tooltip.showDelay = 500;
tooltip.closeDelay = 200;
tooltip.isOpen = false;
tooltip.templates = {};

/**
 * Adds a named template to be displayed later.
 * @param {string} name Template name
 * @param {string|HTMLElement} content Template content
 */
tooltip.addTemplate = function (name, content) {
	if (typeof name !== 'string')
		throw `[tooltip] Template name must be a string, "${typeof name}" given.`;

	this.templates[name] = content;
};

/**
 * Attaches tooltip listeners to an element.
 * @param {HTMLElement} element
 * @param {string|HTMLElement} content
 */
tooltip.addListeners = function (element, content) {
	var timeout;

	element.addEventListener('mouseover', () => {
		timeout = window.setTimeout(() => {
			timeout = null;
			tooltip(element, content);
		}, this.showDelay);
	});

	element.addEventListener('mouseout', () => {
		if (timeout) {
			window.clearTimeout(timeout);
			timeout = null;

			return;
		}

		window.setTimeout(() => this.close(), this.closeDelay);
	});
};

/**
 * Clears the current contents.
 */
tooltip.clear = function () {
	if (typeof this.onclear === 'function')
		this.onclear();

	this.content.textContent = null;

	while (this.content.children.length)
		this.content.firstChild.remove();
};

/**
 * Closes the tooltip and clears its contents.
 */
tooltip.close = function () {
	if (!this.isOpen) return;

	if (typeof this.onclose === 'function')
		this.onclose();

	this.container.classList.remove('show', 'under', 'left', 'right');
	this.isOpen = false;

	this.clear();
};

(function () {
	tooltip.content.addEventListener('click', e => e.stopPropagation());

	// load in templates
	var templateList = document.getElementsByClassName('-tooltip-templates');

	while (templateList.length) {
		let templates = templateList[0];

		for (let template of templates.children)
			tooltip.addTemplate(template.dataset.name, template);

		templates.parentElement.removeChild(templates);
	}

	// attach tooltips
	var elements = document.querySelectorAll('[data-tooltip]');

	for (let el of elements)
		tooltip.addListeners(el, el.dataset.tooltip);
})();