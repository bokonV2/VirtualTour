# VirtualTour
## _HTML widget for interactive viewing of photos_

[![N|Solid](https://img.shields.io/badge/POWERED_BY-<IdiocyPatience>-green?style=for-the-badge)](https://nodesource.com/products/nsolid)

[![Build Status](https://img.shields.io/badge/Status-build-orange)](https://github.com/bokonV2/VirtualTour/issues)

## Features
- Simple buider for data file
- Optimize for mobile

## Tech

Dillinger uses a number of open source projects to work properly:

- [jQuery] - Duh
- [jqueryClickAndHold] - Smooth movement

## Installation
Add to html 
```html
<!-- обязательно сохранить порядок элементов -->
    <div class="entry-content clearfix" style="display:flex; flex-direction:column; align-items:center; justify-content:center; margin-top: 10px">
      <canvas></canvas>
    </div>
    <script src="/static/js/jquery.click-hold.js"></script>
    <script src="/static/js/button.js"></script>
    <script src="/static/js/master.js"></script>
```

## License

[GPL]
    
[GPL]: <https://github.com/bokonV2/VirtualTour/blob/main/LICENSE>
[jQuery]: <http://jquery.com>
[jqueryClickAndHold]: <https://github.com/phuong/jqueryClickAndHold>
