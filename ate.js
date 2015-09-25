var Ate = (function () {
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
			[/(")(?![^{{]*}})/g, '\\"'],
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
		];

	exports.template = function (_templateString) {
		return function (_context) {
			_context = _context || {};
			return eval('(' + fnBegin + (function () {
					for (var i = 0; i < regexp.length; i++) {
						_templateString = _templateString.replace(regexp[i][0], regexp[i][1]);
					}

					return _templateString;

				})() + '";return out})').call(_context, {}, _context, false, helpers, partials);

		}

	};

	exports.addHelper = function (_helperName, _function) {
		helpers[_helperName] = _function;
	};

	exports.addPartial = function (_partialName, _templateString) {
		partials[_partialName] = exports.template(_templateString);
	};

	return exports;

})();
