// dataset
if (window.navigator.userAgent.indexOf('MSIE') >= 1 && window.HTMLElement && Object.getOwnPropertyNames(HTMLElement.prototype).indexOf('dataset') === -1) {
    Object.defineProperty(HTMLElement.prototype, 'dataset', {
        get: function () {
            var attributes = this.attributes;
            var name = [];
            var value = [];
            var obj = {};
            for (var i = 0; i < attributes.length; i++) {
                if (attributes[i].nodeName.slice(0, 5) === 'data-') {
                    name.push(attributes[i].nodeName.slice(5));
                    value.push(attributes[i].nodeValue);
                }
            }
            for (var j = 0; j < name.length; j++) {
                obj[name[j]] = value[j];
            }
            return obj;
        }
    });
}

// performance.now()
if (window.navigator.userAgent.indexOf('MSIE 9.0') >= 1 && window.performance) {
    window.performance.now = function () {
        return ((+new Date()) - performance.timing.navigationStart);
    };
}

// currentScript
if (window.navigator.userAgent.indexOf('Chrome') === -1) {
    Object.defineProperty(Document.prototype, 'currentScript', {
        get: function () {
            var src;
            try {
                throw new Error('Make an error for tracing the current script.');
            } catch (error) {
                var stack = error.stack;
                if (stack !== undefined) {
                    stack = stack.split(/[@ ]/g).pop();
                    stack = stack[0] === '(' ? stack.slice(1, -1) : stack;// There is a pair of brackets in IE11 and Edge
                    src = stack.replace(/\n/g, '').replace(/(:\d+)?:\d+$/i, '');// There is a '\n' char at the end of the line in Firefox
                    return {src: src};
                }
            }
            // IE5-9
            for (var scripts = document.scripts, i = scripts.length - 1, script = scripts[i]; i >= 0; i--) {
                if (script.readyState === 'interactive') {
                    if (document.all && !document.querySelector) {
                        src = script.getAttribute('src', 4);// if less than ie 8, must get full path by getAttribute(src, 4)
                    } else {
                        src = script.src;
                    }
                    return {src: src};
                }
            }
        }
    });
}

export default {};
