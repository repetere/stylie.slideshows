<a name="fullWidthSlideshow"></a>
#class: fullWidthSlideshow
**Members**

* [class: fullWidthSlideshow](#fullWidthSlideshow)
  * [new fullWidthSlideshow(config, options)](#new_fullWidthSlideshow)
  * [fullWidthSlideshow._init()](#fullWidthSlideshow#_init)
  * [fullWidthSlideshow._config()](#fullWidthSlideshow#_config)
  * [fullWidthSlideshow._initEvents()](#fullWidthSlideshow#_initEvents)
  * [fullWidthSlideshow._navigate(direction)](#fullWidthSlideshow#_navigate)
  * [fullWidthSlideshow._slide()](#fullWidthSlideshow#_slide)
  * [fullWidthSlideshow._toggleNavControls()](#fullWidthSlideshow#_toggleNavControls)
  * [fullWidthSlideshow._jump(position)](#fullWidthSlideshow#_jump)
  * [fullWidthSlideshow.destroy()](#fullWidthSlideshow#destroy)

<a name="new_fullWidthSlideshow"></a>
##new fullWidthSlideshow(config, options)
A module that represents a full with slideshow componenet object, a slidie is a slideshow.

**Params**

- config `object` - {el -  element of tab container}  
- options `object` - configuration options  

**Author**: Yaw Joseph Etse  
**License**: MIT  
**Copyright**: Copyright (c) 2014 Typesettin. All rights reserved.  
<a name="fullWidthSlideshow#_init"></a>
##fullWidthSlideshow._init()
module default configuration

<a name="fullWidthSlideshow#_config"></a>
##fullWidthSlideshow._config()
initializes slideshow and shows current slide.

<a name="fullWidthSlideshow#_initEvents"></a>
##fullWidthSlideshow._initEvents()
handle slideshow click events.

<a name="fullWidthSlideshow#_navigate"></a>
##fullWidthSlideshow._navigate(direction)
move slideshow to slide based on the direction.

**Params**

- direction `string` - (previous|next) slide  

<a name="fullWidthSlideshow#_slide"></a>
##fullWidthSlideshow._slide()
slide to show this.current(index) slide.

<a name="fullWidthSlideshow#_toggleNavControls"></a>
##fullWidthSlideshow._toggleNavControls()
update slideshow ui.

<a name="fullWidthSlideshow#_jump"></a>
##fullWidthSlideshow._jump(position)
jump to specific slide.

**Params**

- position `number` - slide to show  

<a name="fullWidthSlideshow#destroy"></a>
##fullWidthSlideshow.destroy()
delete/remove slideshow elements

