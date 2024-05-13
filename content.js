function getXPath(element) {
  if (element.id) {
    return '//*[@id="' + element.id + '"]';
  } 
  if (element === document.body) {
    return '/html/body';
  }

  let ix = 0;
  const siblings = element.parentNode.childNodes;
  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i];
    if (sibling === element) {
      const tagName = element.tagName.toLowerCase();
      const nthOfType = ix + 1;
      return getXPath(element.parentNode) + '/' + tagName + '[' + nthOfType + ']';
    }
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
      ix++;
    }
  }
}

function addXPathTooltip(event) {
  const xpath = getXPath(event.target);
  const tooltip = document.createElement('div');
  tooltip.style.position = 'absolute';
  tooltip.style.backgroundColor = 'yellow';
  tooltip.style.border = '1px solid black';
  tooltip.style.padding = '2px';
  tooltip.style.zIndex = '10000';
  tooltip.innerText = xpath;

  document.body.appendChild(tooltip);

  const updateTooltipPosition = (e) => {
    tooltip.style.left = e.pageX + 'px';
    tooltip.style.top = e.pageY + 'px';
  };

  updateTooltipPosition(event);
  event.target.addEventListener('pointermove', updateTooltipPosition);

  event.target.addEventListener('pointerleave', () => {
    tooltip.remove();
    event.target.removeEventListener('pointermove', updateTooltipPosition);
  }, { once: true });
}

chrome.storage.local.get('isActive', ({ isActive }) => {
  if (isActive) {
    document.addEventListener('pointerenter', addXPathTooltip);
  } else {
    document.removeEventListener('pointerenter', addXPathTooltip);
  }
});
