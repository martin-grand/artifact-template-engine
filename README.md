# Artifact template engine
Artifact template engine is a javascript templating engine.

### Incredibly small
- less then 100 rows (with comments)
- less then 1kb (0,866 KB gzipped)

### Incredibly fast
- It uses regular expressions
- More than 10 times faster compared to Handlebars

### Incredibly smart
You can do anything that javascript can do!

### Incredibly simple to use
Based on Handlebars syntax, but you can do much more variations , in a much simpler way!

#How it works?
Compile a template in JavaScript by using Arti


```js
var source = '<span>{{this.name}} is {{this.age}} years old.</span>',
    engine = new Arti();
    template = engine.template(source);
```

Get the HTML result of evaluating an ArtiTemplate by executing the template with a context.


```js
var context = {name: 'Sheldon Cooper', age: 35},
    html = template(context);
```
results in

```html
<span>Sheldon Cooper is 35 years old.</span>
```

# Working examples

### Simple data pass
source:
```html
<span class="character">{{this.name}} is {{this.age}} years old.</span>
```
result with `{"name":"Sheldon Cooper","age":35}` context:
```html
<span class="character">Sheldon Cooper is 35 years old.</span>
```

### Set up defaults
source:
```html
<span class="character">{{this.name || 'the user'}} is {{this.age || 'some'}} years old.</span>
```
result with `{}` context:
```html
<span class="character">the user is some years old.</span>
```

### Use comments
source:
```hbs
this is invisible: {{!anithing you want to hide}}
This is also invisible:
{{!--
{{this.something}}
--}}
```
result with `{}` context:
```html
this is invisible: 
This is also invisible:
```

### Use operations
source:
```html
<p>{{this.name}} will be {{this.age + 1}} years old next year.</p>
```
result with `{"name":"Sheldon Cooper","age":35}` context:
```html
<p>Sheldon Cooper will be 36 years old next year.</p>
```

### Simple operations
source:
```html
<p>one day contains {{24*60*60}} second.</p>
```
result with `{}` context:
```html
<p>one day contains 86400 second.</p>
```

### Conditions
source:
```html
{{this.name}} is 
{{#if this.age > 30}} 
	older than 30.
{{#elseif this.age === 30}} 
	exactly 30 years old.
{{#else}}
	younger than 30.
{{/if}}
```
result with `{"name":"Sheldon Cooper","age":35}` context:
```html
Sheldon Cooper is older than 30.
```
result with `{"name":"Sheldon Cooper","age":20}` context:
```html
Sheldon Cooper is younger than 30.
```
result with `{"name":"Sheldon Cooper","age":30}` context:
```html
Sheldon Cooper is exactly 30 years old.
```

### Use each
source:
```html
<ul>
	{{#each this}}
	<li>{{this}}</li>
	{{/each}}
</ul>
```
result with `{"leonard":"Leonard Hofstadter","sheldon":"Sheldon Cooper"}` or `[{"name":"Sheldon Cooper"},{"name":"Leonard Hofstadter"}]` context:
```html
<ul>
	<li>Sheldon Cooper</li>
	<li>Leonard Hofstadter</li>
</ul>
```

### Use `meta.parent.context` variable
source:
```html
<ul>
	{{#each this}}
	<li>{{meta.parent.context.sheldon}} smarter than {{this}}</li>
	{{/each}}
</ul>
```
result with `{"leonard":"Leonard Hofstadter","sheldon":"Sheldon Cooper"}` context:
```html
<ul>
	<li>Sheldon Cooper smarter than Leonard Hofstadter</li>
	<li>Sheldon Cooper smarter than Sheldon Cooper</li>
</ul>
```

### Use `meta.parent.parent.context` or `root` variable
source:
```html
<ul>
	{{#each this}}
	<li class="character">{{this.name}}'s friends:
		<ul class="friends">
			{{#each this.friends}}
			<li>{{this}} (but {{meta.parent.parent.context.sheldon.name}} still better)</li>
			{{/each}}
		</ul>
	</li>
	{{/each}}
</ul>

<!-- or with root: -->

<ul>
	{{#each this}}
	<li class="character">{{this.name}}'s friends:
		<ul class="friends">
			{{#each this.friends}}
			<li>{{this}} (but {{root.sheldon.name}} still better)</li>
			{{/each}}
		</ul>
	</li>
	{{/each}}
</ul>
```
result with `{"leonard":{"name":"Leonard Hofstadter","friends":["Penny","Howard Wolowitz","Raj Koothrappali"]},"sheldon":{"name":"Sheldon Cooper","friends":["Sheldon Cooper"]}}` context:
```html
<ul>
	<li class="character">Leonard Hofstadter's friends:
		<ul class="friends">
			<li>Penny (but Sheldon Cooper still better)</li>
			<li>Howard Wolowitz (but Sheldon Cooper still better)</li>
			<li>Raj Koothrappali (but Sheldon Cooper still better)</li>
		</ul>
	</li>
	<li class="character">Sheldon Cooper's friends:
		<ul class="friends">
			<li>Sheldon Cooper (but Sheldon Cooper still better)</li>
		</ul>
	</li>
</ul>
```

## Helpers
You can create your own helpers as well


```js
var engine = new Arti(),
    tpl;

engine.addHelper('reverse', function(contentBlock){
    return contentBlock().split('').reverse().join('');      
});

tplEngine.addHelper('reverseArg', function(arg){
    return arg.split('').reverse().join('');      
});

engine.template('{{#reverse}}YEAHH{{/reverse}}')();
// result: "HHAEY"

engine.template('{{#reverseArg this.text /}}')({text : "YEAHH"});
// result: "HHAEY"
```
## Partials
You can add your partial as well


```js
var engine = new Arti(),
    tpl;

engine.addPartial(
    'person', 
    '<span class="person">{{this.name}}</span>'
);

engine.template('{{>person this}}')({"name":"Sheldon"});
// result: <span class="person">Sheldon</span>
```

performance test nad sandbox:
http://codepen.io/martingrand/full/mEbPOP/
