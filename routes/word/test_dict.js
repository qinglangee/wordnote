var dict = require('./dict');

var words =["captious", 
"captivate", 
"inception", 
"exceptional", 
"unexceptionable", 
"perceptible", 
"perceptive", 
"susceptibility", 
"disciple", 
"emancipate", 
"incipient", 
"principal", 
"preoccupation", 
"recuperate", 
"exemplary", 
"exempt", 
"peremptory", 
"preempt", 
"presumptuous", 
"sumptuous", 
"poke", 
"essentially", 
"cram", 
"indie", 
"stow", 
"grinder", 
"lateral", 
"rife", 
"retrospective", 
"industrial", 
"plot", 
"gamut", 
"symmetric", 
"surrealist", 
"celebrity", 
"calf", 
"dramatic", 
"detract", 
"aptly", 
"dongle", 
"famed", 
"paralyze"];

for(var i=0;i<words.length;i++){
	var text = words[i];
	dict.search(text, function(word){
		console.log(word);
	});
}
