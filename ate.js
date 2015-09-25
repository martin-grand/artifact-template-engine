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

		fnBegin = 'function(meta,root,parent,helpers,partials){meta=meta||{};meta.context=this;meta.parent=parent;var out="',
		regexp = [
			[/\n/g, '\\n'],// handle new lines
			[/({{!--.+?--}}|{{!.+?}})/g, ''], // remove comments {{!-- xy --}} or {{! xy}}
			[/(")(?![^{{]*}})/g, '\\"'], // handle double quotes
			[/{{#if (.+?)}}/g, '";if($1){out+="'], // if
			[/{{#elseif (.+?)}}/g, '"}else if($1){out+="'], // else if
			[/{{#else}}/g, '"}else{out+="'], // else
			[/{{\/if}}/g, '"}out+="'], // end if
			[/{{#(.+?) (.+?)\/}}/g, '"+helpers.$1.call(this,($2))+"'], // singe helper
			[/{{#(.+?)\/}}/g, '"+helpers.$1.call(this)+"'], // singe helper without arguments
			[/{{#(.+?) (.+?)}}/g, '"+helpers.$1.call(this,($2),function(c,m){return(' + fnBegin], // open block helper
			[/{{#(.+?)}}/g, '"+helpers.$1(function(c,m){return(' + fnBegin], // pen block helper without arguments
			[/{{\/(.+?)}}/g, '";return out}).call(c,m,root,meta,helpers,partials)})+"'], // end block helper
			[/{{>(.+?) (.+?)}}/g, '"+partials.$1($2)+"'], // partial
			[/{{>(.+?)}}/g, '"+partials.$1()+"'], // partial without arguments
			[/{{(.+?)}}/g, '"+($1)+"'] // default
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
