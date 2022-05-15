import{e as enableDismissTrigger,d as defineJQueryPlugin,B as BaseComponent,E as EventHandler,r as reflow,M as Manipulator,a as typeCheckConfig}from"./dom.min.js?5.1.3";const NAME="toast",DATA_KEY="bs.toast",EVENT_KEY=".bs.toast",EVENT_MOUSEOVER="mouseover.bs.toast",EVENT_MOUSEOUT="mouseout.bs.toast",EVENT_FOCUSIN="focusin.bs.toast",EVENT_FOCUSOUT="focusout.bs.toast",EVENT_HIDE="hide.bs.toast",EVENT_HIDDEN="hidden.bs.toast",EVENT_SHOW="show.bs.toast",EVENT_SHOWN="shown.bs.toast",CLASS_NAME_FADE="fade",CLASS_NAME_HIDE="hide",CLASS_NAME_SHOW="show",CLASS_NAME_SHOWING="showing",DefaultType={animation:"boolean",autohide:"boolean",delay:"number"},Default={animation:!0,autohide:!0,delay:5e3};class Toast extends BaseComponent{constructor(e,t){super(e),this._config=this._getConfig(t),this._timeout=null,this._hasMouseInteraction=!1,this._hasKeyboardInteraction=!1,this._setListeners()}static get DefaultType(){return DefaultType}static get Default(){return Default}static get NAME(){return NAME}show(){if(EventHandler.trigger(this._element,EVENT_SHOW).defaultPrevented)return;this._clearTimeout(),this._config.animation&&this._element.classList.add("fade");this._element.classList.remove("hide"),reflow(this._element),this._element.classList.add("show"),this._element.classList.add("showing"),this._queueCallback((()=>{this._element.classList.remove("showing"),EventHandler.trigger(this._element,EVENT_SHOWN),this._maybeScheduleHide()}),this._element,this._config.animation)}hide(){if(!this._element.classList.contains("show"))return;if(EventHandler.trigger(this._element,EVENT_HIDE).defaultPrevented)return;this._element.classList.add("showing"),this._queueCallback((()=>{this._element.classList.add("hide"),this._element.classList.remove("showing"),this._element.classList.remove("show"),EventHandler.trigger(this._element,EVENT_HIDDEN)}),this._element,this._config.animation)}dispose(){this._clearTimeout(),this._element.classList.contains("show")&&this._element.classList.remove("show"),super.dispose()}_getConfig(e){return e={...Default,...Manipulator.getDataAttributes(this._element),..."object"==typeof e&&e?e:{}},typeCheckConfig(NAME,e,this.constructor.DefaultType),e}_maybeScheduleHide(){this._config.autohide&&(this._hasMouseInteraction||this._hasKeyboardInteraction||(this._timeout=setTimeout((()=>{this.hide()}),this._config.delay)))}_onInteraction(e,t){switch(e.type){case"mouseover":case"mouseout":this._hasMouseInteraction=t;break;case"focusin":case"focusout":this._hasKeyboardInteraction=t}if(t)return void this._clearTimeout();const s=e.relatedTarget;this._element===s||this._element.contains(s)||this._maybeScheduleHide()}_setListeners(){EventHandler.on(this._element,EVENT_MOUSEOVER,(e=>this._onInteraction(e,!0))),EventHandler.on(this._element,EVENT_MOUSEOUT,(e=>this._onInteraction(e,!1))),EventHandler.on(this._element,EVENT_FOCUSIN,(e=>this._onInteraction(e,!0))),EventHandler.on(this._element,EVENT_FOCUSOUT,(e=>this._onInteraction(e,!1)))}_clearTimeout(){clearTimeout(this._timeout),this._timeout=null}static jQueryInterface(e){return this.each((function(){const t=Toast.getOrCreateInstance(this,e);if("string"==typeof e){if(void 0===t[e])throw new TypeError(`No method named "${e}"`);t[e](this)}}))}}if(enableDismissTrigger(Toast),defineJQueryPlugin(Toast),window.bootstrap=window.bootstrap||{},window.bootstrap.Toast=Toast,Joomla&&Joomla.getOptions){const e=Joomla.getOptions("bootstrap.toast");"object"==typeof e&&null!==e&&Object.keys(e).forEach((t=>{const s=e[t],i={animation:!s.animation||s.animation,autohide:!s.autohide||s.autohide,delay:s.delay?s.delay:5e3},o=Array.from(document.querySelectorAll(t));o.length&&o.map((e=>new window.bootstrap.Toast(e,i)))}))}export{Toast as T};