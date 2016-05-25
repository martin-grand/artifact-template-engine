# Artifact template engine
Artifact template engine is a javascript templateing engine.

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
// resut: "HHAEY"

engine.template('{{#reverseArg this.text /}}')({text : "YEAHH"});
// resut: "HHAEY"
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
// resut: <span class="person">Sheldon</span>
```

working examples:
http://codepen.io/martingrand/full/MegeEW/

performance test:
http://codepen.io/martingrand/full/mEbPOP/
