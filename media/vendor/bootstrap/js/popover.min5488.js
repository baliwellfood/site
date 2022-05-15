import{b as isRTL,d as defineJQueryPlugin,B as BaseComponent,E as EventHandler,o as findShadowRoot,p as getUID,D as Data,n as noop,S as SelectorEngine,k as isElement,h as getElement,s as sanitizeHtml,M as Manipulator,a as typeCheckConfig,q as DefaultAllowlist}from"./dom.min.js?5.1.3";import{P as Popper,c as createPopper}from"./popper.min.js?5.1.3";const NAME$1="tooltip",DATA_KEY$1="bs.tooltip",EVENT_KEY$1=".bs.tooltip",CLASS_PREFIX$1="bs-tooltip",DISALLOWED_ATTRIBUTES=new Set(["sanitize","allowList","sanitizeFn"]),DefaultType$1={animation:"boolean",template:"string",title:"(string|element|function)",trigger:"string",delay:"(number|object)",html:"boolean",selector:"(string|boolean)",placement:"(string|function)",offset:"(array|string|function)",container:"(string|element|boolean)",fallbackPlacements:"array",boundary:"(string|element)",customClass:"(string|function)",sanitize:"boolean",sanitizeFn:"(null|function)",allowList:"object",popperConfig:"(null|object|function)"},AttachmentMap={AUTO:"auto",TOP:"top",RIGHT:isRTL()?"left":"right",BOTTOM:"bottom",LEFT:isRTL()?"right":"left"},Default$1={animation:!0,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,selector:!1,placement:"top",offset:[0,0],container:!1,fallbackPlacements:["top","right","bottom","left"],boundary:"clippingParents",customClass:"",sanitize:!0,sanitizeFn:null,allowList:DefaultAllowlist,popperConfig:null},Event$1={HIDE:"hide.bs.tooltip",HIDDEN:"hidden.bs.tooltip",SHOW:"show.bs.tooltip",SHOWN:"shown.bs.tooltip",INSERTED:"inserted.bs.tooltip",CLICK:"click.bs.tooltip",FOCUSIN:"focusin.bs.tooltip",FOCUSOUT:"focusout.bs.tooltip",MOUSEENTER:"mouseenter.bs.tooltip",MOUSELEAVE:"mouseleave.bs.tooltip"},CLASS_NAME_FADE="fade",CLASS_NAME_MODAL="modal",CLASS_NAME_SHOW="show",HOVER_STATE_SHOW="show",HOVER_STATE_OUT="out",SELECTOR_TOOLTIP_INNER=".tooltip-inner",SELECTOR_MODAL=".modal",EVENT_MODAL_HIDE="hide.bs.modal",TRIGGER_HOVER="hover",TRIGGER_FOCUS="focus",TRIGGER_CLICK="click",TRIGGER_MANUAL="manual";class Tooltip extends BaseComponent{constructor(t,e){if(void 0===Popper)throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org)");super(t),this._isEnabled=!0,this._timeout=0,this._hoverState="",this._activeTrigger={},this._popper=null,this._config=this._getConfig(e),this.tip=null,this._setListeners()}static get Default(){return Default$1}static get NAME(){return NAME$1}static get Event(){return Event$1}static get DefaultType(){return DefaultType$1}enable(){this._isEnabled=!0}disable(){this._isEnabled=!1}toggleEnabled(){this._isEnabled=!this._isEnabled}toggle(t){if(this._isEnabled)if(t){const e=this._initializeOnDelegatedTarget(t);e._activeTrigger.click=!e._activeTrigger.click,e._isWithActiveTrigger()?e._enter(null,e):e._leave(null,e)}else{if(this.getTipElement().classList.contains("show"))return void this._leave(null,this);this._enter(null,this)}}dispose(){clearTimeout(this._timeout),EventHandler.off(this._element.closest(".modal"),"hide.bs.modal",this._hideModalHandler),this.tip&&this.tip.remove(),this._disposePopper(),super.dispose()}show(){if("none"===this._element.style.display)throw new Error("Please use show on visible elements");if(!this.isWithContent()||!this._isEnabled)return;const t=EventHandler.trigger(this._element,this.constructor.Event.SHOW),e=findShadowRoot(this._element),i=null===e?this._element.ownerDocument.documentElement.contains(this._element):e.contains(this._element);if(t.defaultPrevented||!i)return;"tooltip"===this.constructor.NAME&&this.tip&&this.getTitle()!==this.tip.querySelector(".tooltip-inner").innerHTML&&(this._disposePopper(),this.tip.remove(),this.tip=null);const o=this.getTipElement(),n=getUID(this.constructor.NAME);o.setAttribute("id",n),this._element.setAttribute("aria-describedby",n),this._config.animation&&o.classList.add("fade");const s="function"==typeof this._config.placement?this._config.placement.call(this,o,this._element):this._config.placement,l=this._getAttachment(s);this._addAttachmentClass(l);const{container:a}=this._config;Data.set(o,this.constructor.DATA_KEY,this),this._element.ownerDocument.documentElement.contains(this.tip)||(a.append(o),EventHandler.trigger(this._element,this.constructor.Event.INSERTED)),this._popper?this._popper.update():this._popper=createPopper(this._element,o,this._getPopperConfig(l)),o.classList.add("show");const r=this._resolvePossibleFunction(this._config.customClass);r&&o.classList.add(...r.split(" ")),"ontouchstart"in document.documentElement&&[].concat(...document.body.children).forEach((t=>{EventHandler.on(t,"mouseover",noop)}));const c=this.tip.classList.contains("fade");this._queueCallback((()=>{const t=this._hoverState;this._hoverState=null,EventHandler.trigger(this._element,this.constructor.Event.SHOWN),"out"===t&&this._leave(null,this)}),this.tip,c)}hide(){if(!this._popper)return;const t=this.getTipElement();if(EventHandler.trigger(this._element,this.constructor.Event.HIDE).defaultPrevented)return;t.classList.remove("show"),"ontouchstart"in document.documentElement&&[].concat(...document.body.children).forEach((t=>EventHandler.off(t,"mouseover",noop))),this._activeTrigger.click=!1,this._activeTrigger.focus=!1,this._activeTrigger.hover=!1;const e=this.tip.classList.contains("fade");this._queueCallback((()=>{this._isWithActiveTrigger()||("show"!==this._hoverState&&t.remove(),this._cleanTipClass(),this._element.removeAttribute("aria-describedby"),EventHandler.trigger(this._element,this.constructor.Event.HIDDEN),this._disposePopper())}),this.tip,e),this._hoverState=""}update(){null!==this._popper&&this._popper.update()}isWithContent(){return Boolean(this.getTitle())}getTipElement(){if(this.tip)return this.tip;const t=document.createElement("div");t.innerHTML=this._config.template;const e=t.children[0];return this.setContent(e),e.classList.remove("fade","show"),this.tip=e,this.tip}setContent(t){this._sanitizeAndSetContent(t,this.getTitle(),".tooltip-inner")}_sanitizeAndSetContent(t,e,i){const o=SelectorEngine.findOne(i,t);e||!o?this.setElementContent(o,e):o.remove()}setElementContent(t,e){if(null!==t)return isElement(e)?(e=getElement(e),void(this._config.html?e.parentNode!==t&&(t.innerHTML="",t.append(e)):t.textContent=e.textContent)):void(this._config.html?(this._config.sanitize&&(e=sanitizeHtml(e,this._config.allowList,this._config.sanitizeFn)),t.innerHTML=e):t.textContent=e)}getTitle(){const t=this._element.getAttribute("data-bs-original-title")||this._config.title;return this._resolvePossibleFunction(t)}updateAttachment(t){return"right"===t?"end":"left"===t?"start":t}_initializeOnDelegatedTarget(t,e){return e||this.constructor.getOrCreateInstance(t.delegateTarget,this._getDelegateConfig())}_getOffset(){const{offset:t}=this._config;return"string"==typeof t?t.split(",").map((t=>Number.parseInt(t,10))):"function"==typeof t?e=>t(e,this._element):t}_resolvePossibleFunction(t){return"function"==typeof t?t.call(this._element):t}_getPopperConfig(t){const e={placement:t,modifiers:[{name:"flip",options:{fallbackPlacements:this._config.fallbackPlacements}},{name:"offset",options:{offset:this._getOffset()}},{name:"preventOverflow",options:{boundary:this._config.boundary}},{name:"arrow",options:{element:`.${this.constructor.NAME}-arrow`}},{name:"onChange",enabled:!0,phase:"afterWrite",fn:t=>this._handlePopperPlacementChange(t)}],onFirstUpdate:t=>{t.options.placement!==t.placement&&this._handlePopperPlacementChange(t)}};return{...e,..."function"==typeof this._config.popperConfig?this._config.popperConfig(e):this._config.popperConfig}}_addAttachmentClass(t){this.getTipElement().classList.add(`${this._getBasicClassPrefix()}-${this.updateAttachment(t)}`)}_getAttachment(t){return AttachmentMap[t.toUpperCase()]}_setListeners(){this._config.trigger.split(" ").forEach((t=>{if("click"===t)EventHandler.on(this._element,this.constructor.Event.CLICK,this._config.selector,(t=>this.toggle(t)));else if("manual"!==t){const e="hover"===t?this.constructor.Event.MOUSEENTER:this.constructor.Event.FOCUSIN,i="hover"===t?this.constructor.Event.MOUSELEAVE:this.constructor.Event.FOCUSOUT;EventHandler.on(this._element,e,this._config.selector,(t=>this._enter(t))),EventHandler.on(this._element,i,this._config.selector,(t=>this._leave(t)))}})),this._hideModalHandler=()=>{this._element&&this.hide()},EventHandler.on(this._element.closest(".modal"),"hide.bs.modal",this._hideModalHandler),this._config.selector?this._config={...this._config,trigger:"manual",selector:""}:this._fixTitle()}_fixTitle(){const t=this._element.getAttribute("title"),e=typeof this._element.getAttribute("data-bs-original-title");(t||"string"!==e)&&(this._element.setAttribute("data-bs-original-title",t||""),!t||this._element.getAttribute("aria-label")||this._element.textContent||this._element.setAttribute("aria-label",t),this._element.setAttribute("title",""))}_enter(t,e){e=this._initializeOnDelegatedTarget(t,e),t&&(e._activeTrigger["focusin"===t.type?"focus":"hover"]=!0),e.getTipElement().classList.contains("show")||"show"===e._hoverState?e._hoverState="show":(clearTimeout(e._timeout),e._hoverState="show",e._config.delay&&e._config.delay.show?e._timeout=setTimeout((()=>{"show"===e._hoverState&&e.show()}),e._config.delay.show):e.show())}_leave(t,e){e=this._initializeOnDelegatedTarget(t,e),t&&(e._activeTrigger["focusout"===t.type?"focus":"hover"]=e._element.contains(t.relatedTarget)),e._isWithActiveTrigger()||(clearTimeout(e._timeout),e._hoverState="out",e._config.delay&&e._config.delay.hide?e._timeout=setTimeout((()=>{"out"===e._hoverState&&e.hide()}),e._config.delay.hide):e.hide())}_isWithActiveTrigger(){for(const t in this._activeTrigger)if(this._activeTrigger[t])return!0;return!1}_getConfig(t){const e=Manipulator.getDataAttributes(this._element);return Object.keys(e).forEach((t=>{DISALLOWED_ATTRIBUTES.has(t)&&delete e[t]})),(t={...this.constructor.Default,...e,..."object"==typeof t&&t?t:{}}).container=!1===t.container?document.body:getElement(t.container),"number"==typeof t.delay&&(t.delay={show:t.delay,hide:t.delay}),"number"==typeof t.title&&(t.title=t.title.toString()),"number"==typeof t.content&&(t.content=t.content.toString()),typeCheckConfig(NAME$1,t,this.constructor.DefaultType),t.sanitize&&(t.template=sanitizeHtml(t.template,t.allowList,t.sanitizeFn)),t}_getDelegateConfig(){const t={};for(const e in this._config)this.constructor.Default[e]!==this._config[e]&&(t[e]=this._config[e]);return t}_cleanTipClass(){const t=this.getTipElement(),e=new RegExp(`(^|\\s)${this._getBasicClassPrefix()}\\S+`,"g"),i=t.getAttribute("class").match(e);null!==i&&i.length>0&&i.map((t=>t.trim())).forEach((e=>t.classList.remove(e)))}_getBasicClassPrefix(){return"bs-tooltip"}_handlePopperPlacementChange(t){const{state:e}=t;e&&(this.tip=e.elements.popper,this._cleanTipClass(),this._addAttachmentClass(this._getAttachment(e.placement)))}_disposePopper(){this._popper&&(this._popper.destroy(),this._popper=null)}static jQueryInterface(t){return this.each((function(){const e=Tooltip.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t]()}}))}}defineJQueryPlugin(Tooltip);const NAME="popover",DATA_KEY="bs.popover",EVENT_KEY=".bs.popover",CLASS_PREFIX="bs-popover",Default={...Tooltip.Default,placement:"right",offset:[0,8],trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'},DefaultType={...Tooltip.DefaultType,content:"(string|element|function)"},Event={HIDE:"hide.bs.popover",HIDDEN:"hidden.bs.popover",SHOW:"show.bs.popover",SHOWN:"shown.bs.popover",INSERTED:"inserted.bs.popover",CLICK:"click.bs.popover",FOCUSIN:"focusin.bs.popover",FOCUSOUT:"focusout.bs.popover",MOUSEENTER:"mouseenter.bs.popover",MOUSELEAVE:"mouseleave.bs.popover"},SELECTOR_TITLE=".popover-header",SELECTOR_CONTENT=".popover-body";class Popover extends Tooltip{static get Default(){return Default}static get NAME(){return NAME}static get Event(){return Event}static get DefaultType(){return DefaultType}isWithContent(){return this.getTitle()||this._getContent()}setContent(t){this._sanitizeAndSetContent(t,this.getTitle(),SELECTOR_TITLE),this._sanitizeAndSetContent(t,this._getContent(),".popover-body")}_getContent(){return this._resolvePossibleFunction(this._config.content)}_getBasicClassPrefix(){return"bs-popover"}static jQueryInterface(t){return this.each((function(){const e=Popover.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t]()}}))}}if(defineJQueryPlugin(Popover),window.bootstrap=window.bootstrap||{},window.bootstrap.Popover=Popover,window.bootstrap.Tooltip=Tooltip,Joomla&&Joomla.getOptions){const t=Joomla.getOptions("bootstrap.tooltip"),e=Joomla.getOptions("bootstrap.popover");"object"==typeof e&&null!==e&&Object.keys(e).forEach((t=>{const i=e[t],o={animation:!i.animation||i.animation,container:!!i.container&&i.container,delay:i.delay?i.delay:0,html:!!i.html&&i.html,placement:i.placement?i.placement:"top",selector:!!i.selector&&i.selector,title:i.title?i.title:"",trigger:i.trigger?i.trigger:"click",offset:i.offset?i.offset:0,fallbackPlacement:i.fallbackPlacement?i.fallbackPlacement:"flip",boundary:i.boundary?i.boundary:"scrollParent",customClass:i.customClass?i.customClass:"",sanitize:!i.sanitize||i.sanitize,sanitizeFn:i.sanitizeFn?i.sanitizeFn:null,popperConfig:i.popperConfig?i.popperConfig:null};i.content&&(o.content=i.content),i.template&&(o.template=i.template),i.allowList&&(o.allowList=i.allowList);const n=Array.from(document.querySelectorAll(t));n.length&&n.map((t=>new window.bootstrap.Popover(t,o)))})),"object"==typeof t&&null!==t&&Object.keys(t).forEach((e=>{const i=t[e],o={animation:!i.animation||i.animation,container:!!i.container&&i.container,delay:i.delay?i.delay:0,html:!!i.html&&i.html,selector:!!i.selector&&i.selector,trigger:i.trigger?i.trigger:"hover focus",fallbackPlacement:i.fallbackPlacement?i.fallbackPlacement:null,boundary:i.boundary?i.boundary:"clippingParents",title:i.title?i.title:"",customClass:i.customClass?i.customClass:"",sanitize:!i.sanitize||i.sanitize,sanitizeFn:i.sanitizeFn?i.sanitizeFn:null,popperConfig:i.popperConfig?i.popperConfig:null};i.placement&&(o.placement=i.placement),i.template&&(o.template=i.template),i.allowList&&(o.allowList=i.allowList);const n=Array.from(document.querySelectorAll(e));n.length&&n.map((t=>new window.bootstrap.Tooltip(t,o)))}))}export{Popover as P};