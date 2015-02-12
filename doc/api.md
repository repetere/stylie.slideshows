<a name="StylieSlideshow"></a>
#class: StylieSlideshow
**Members**

* [class: StylieSlideshow](#StylieSlideshow)
  * [new StylieSlideshow(config, options)](#new_StylieSlideshow)
  * [stylieSlideshow._init()](#StylieSlideshow#_init)
  * [stylieSlideshow._config()](#StylieSlideshow#_config)
  * [stylieSlideshow._initEvents()](#StylieSlideshow#_initEvents)
  * [stylieSlideshow._navigate(direction)](#StylieSlideshow#_navigate)
  * [stylieSlideshow._slide()](#StylieSlideshow#_slide)
  * [stylieSlideshow._toggleNavControls()](#StylieSlideshow#_toggleNavControls)
  * [stylieSlideshow._jump(position)](#StylieSlideshow#_jump)
  * [stylieSlideshow.destroy()](#StylieSlideshow#destroy)

<a name="new_StylieSlideshow"></a>
##new StylieSlideshow(config, options)
A module that represents a full with slideshow componenet object, a stylie.slideshows is a slideshow.

**Params**

- config `object` - {el -  element of tab container}  
- options `object` - configuration options  

**Author**: Yaw Joseph Etse  
**License**: MIT  
**Copyright**: Copyright (c) 2014 Typesettin. All rights reserved.  
<a name="StylieSlideshow#_init"></a>
##stylieSlideshow._init()
module default configuration

<a name="StylieSlideshow#_config"></a>
##stylieSlideshow._config()
initializes slideshow and shows current slide.

<a name="StylieSlideshow#_initEvents"></a>
##stylieSlideshow._initEvents()
handle slideshow click events.

<a name="StylieSlideshow#_navigate"></a>
##stylieSlideshow._navigate(direction)
move slideshow to slide based on the direction.

**Params**

- direction `string` - (previous|next) slide  

<a name="StylieSlideshow#_slide"></a>
##stylieSlideshow._slide()
slide to show this.current(index) slide.

<a name="StylieSlideshow#_toggleNavControls"></a>
##stylieSlideshow._toggleNavControls()
update slideshow ui.

<a name="StylieSlideshow#_jump"></a>
##stylieSlideshow._jump(position)
jump to specific slide.

**Params**

- position `number` - slide to show  

<a name="StylieSlideshow#destroy"></a>
##stylieSlideshow.destroy()
delete/remove slideshow elements

