$debug("Defining HTMLTextAreaElement");
/*
* HTMLTextAreaElement - DOM Level 2
*/
var HTMLTextAreaElement = function(ownerDocument) {
    this.HTMLElement = HTMLElement;
    this.HTMLElement(ownerDocument);
};
HTMLTextAreaElement.prototype = new HTMLElement;
__extend__(HTMLTextAreaElement.prototype, {
    get cols(){
        return this.getAttribute('cols');
    },
    set cols(value){
        this.setAttribute('cols', value);
    },
    get rows(){
        return this.getAttribute('rows');
    },
    set rows(value){
        this.setAttribute('rows', value);
    },

    get defaultValue(){
        return this.getAttribute('defaultValue');
    },
    set defaultValue(value){
        this.setAttribute('defaultValue', value);
    },
    get form(){
        var parent = this.parent;
        while(parent.nodeName.toLowerCase() != 'form'){
            parent = parent.parent;
        }
        return parent;
    },
    get accessKey(){
        return this.getAttribute('accesskey');
    },
    set accessKey(value){
        this.setAttribute('accesskey',value);
    },
    get access(){
        return this.getAttribute('access');
    },
    set access(value){
        this.setAttribute('access', value);
    },
    get disabled(){
        return (this.getAttribute('disabled')=='disabled');
    },
    set disabled(value){
        this.setAttribute('disabled', (value ? 'disabled' :''));
    },
    get maxLength(){
        return Number(this.getAttribute('maxlength')||'0');
    },
    set maxLength(value){
        this.setAttribute('maxlength', value);
    },
    get name(){
        return this.getAttribute('name')||'';
    },
    set name(value){
        this.setAttribute('name', value);
    },
    get readOnly(){
        return (this.getAttribute('readonly')=='readonly');
    },
    set readOnly(value){
        this.setAttribute('readonly', (value ? 'readonly' :''));
    },
    /*get tabIndex(){
        return Number(this.getAttribute('tabindex'));
    },
    set tabIndex(value){
        this.setAttribute('tabindex',Number(value));
    },*/
    get type(){
        return this.getAttribute('type');
    },
    set type(value){
        this.setAttribute('type',value);
    },
    get value(){
        return this.text;
    },
    set value(value){
        if(this.defaultValue===null&&this.text!==null)
            this.defaultValue = this.text;
        return this.text = value;
    },
    blur:function(){
        __blur__(this);

        if (this._oldValue != this.getAttribute('value')){
            var event = document.createEvent();
            event.initEvent("change");
            this.dispatchEvent( event );
        }
    },
    focus:function(){
        __focus__(this);
        this._oldValue = this.getAttribute('value');
    },
    select:function(){
        __select__(this);

    },
    click:function(){
        __click__(this);

    },
    onchange: function(event){
        __eval__(this.getAttribute('onchange')||'', this)
    }
});

$w.HTMLTextAreaElement = HTMLTextAreaElement;
