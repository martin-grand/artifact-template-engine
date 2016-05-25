;(function (engine) {
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = engine;
	} else {
		this.Arti = engine;
	}
})(function () {
	var exports = {},
		partials = {},
		helpers = {
			'each': function (object, contentBlock) {
				var content = '';

				for (var key in object) {
					if (object.hasOwnProperty(key)) {
						content += contentBlock(object[key], {key: key, index: key});
					}
				}
				return content;
			}
		},

		fnBegin = 'function(meta,root,parent,helpers,partials){meta=meta||{};' +
			'meta.context=this;meta.parent=parent;var out="',

		regexp = [
			// handle new lines :
			[/\n/g, '\\n'],
			// remove comments {{!-- xy --}} or {{! xy}} :
			[/({{!--.+?--}}|{{!.+?}})/g, ''],
			// handle double quotes :
			[/(")(?![^{]*}})/g, '\\"'],
			// if :
			[/{{#if (.+?)}}/g, '";if($1){out+="'],
			// else if :
			[/{{#elseif (.+?)}}/g, '"}else if($1){out+="'],
			// else :
			[/{{#else}}/g, '"}else{out+="'],
			// end if :
			[/{{\/if}}/g, '"}out+="'],
			// singe helper :
			[/{{#(.+?) (.+?)\/}}/g, '"+helpers.$1.call(this,($2))+"'],
			// singe helper without arguments :
			[/{{#(.+?)\/}}/g, '"+helpers.$1.call(this)+"'],
			// open block helper :
			[/{{#(.+?) (.+?)}}/g, '"+helpers.$1.call(this,($2),function(c,m){return(' + fnBegin],
			// open block helper without arguments :
			[/{{#(.+?)}}/g, '"+helpers.$1(function(c,m){return(' + fnBegin],
			// end block helper :
			[/{{\/(.+?)}}/g, '";return out}).call(c,m,root,meta,helpers,partials)})+"'],
			// partial :
			[/{{>(.+?) (.+?)}}/g, '"+partials.$1($2)+"'],
			// partial without arguments :
			[/{{>(.+?)}}/g, '"+partials.$1()+"'],
			// default :
			[/{{(.+?)}}/g, '"+($1)+"']
		],
		
		getFnStringFromTemplateString = function(_templateString) {
			var i;
			
			for (i = 0; i < regexp.length; i++) {
				_templateString = _templateString.replace(regexp[i][0], regexp[i][1]);
			}
			return '(' + fnBegin + _templateString + '";return out})';
		};

	exports.template = function(_templateString) {
		var fn;
		
		try {
			fn = eval(getFnStringFromTemplateString(_templateString));
			return function (context) {
				context = context || {};
				return fn.call(context, {}, context, false, helpers, partials);
			}
		} catch (e) {
			console.error('template error:', e, getFnStringFromTemplateString(_templateString));
		}
		
	};

	exports.addHelper = function (_helperName, _function) {
		helpers[_helperName] = _function;
	};

	exports.addPartial = function (_partialName, _templateString) {
		partials[_partialName] = exports.template(_templateString);
	};

	return exports;
	
});
