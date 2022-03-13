# VirtualTour
### _HTML widget for interactive viewing of photos_

[![N|Solid](https://img.shields.io/badge/POWERED_BY-<IdiocyPatience>-green?style=for-the-badge)](https://play.google.com/store/apps/developer?id=IdiocyPatience)

[![Build Status](https://img.shields.io/badge/Status-build-orange)](https://github.com/bokonV2/VirtualTour/issues)

## Features
- [ ] Add a convenient constructor
- [ ] Optimize the design solution for mobile devices
- [ ] Fix the display when changing the canvas height

## Note
- Unstable work on mobile devices
- Display problems when changing the canvas height


## Tech
Dillinger uses a number of open source projects to work properly:
- [jQuery] - Duh
- [jqueryClickAndHold] - Smooth movement (modified)

## Installation
Add to html 
```html
<div class="entry-content clearfix" style="display:flex; flex-direction:column; align-items:center; justify-content:center; margin-top: 10px">
    <!-- data-path = path to /static -->
    <!-- NOTE: don't change data-Cheight -->
    <canvas data-path="" data-Cwidth="800" data-Cheight="600"></canvas>
</div>
<script src="/static/js/button.js?v=1" charset="utf-8"></script>
<script src="/static/js/jquery.click-hold.js?v=1"></script>
<script src="/static/js/master.js?v=1" charset="utf-8"></script>
```
and create a [static] folder on your server

## Support
- [Telegram]
- bokon2014@yandex.by

## License
By using this project you agree to the [GNU] license
    
[static]: <https://github.com/bokonV2/VirtualTour/tree/main/static>
[GNU]: <https://github.com/bokonV2/VirtualTour/blob/main/LICENSE>
[Telegram]: <https://t.me/AyToshi>
[jQuery]: <http://jquery.com>
[jqueryClickAndHold]: <https://github.com/phuong/jqueryClickAndHold>
