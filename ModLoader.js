const registerButton   = $("[register]"  );
const unregisterButton = $("[unregister]");
const modListElement   = $("#modList"    );

const naturalJokers    = Object.keys(RULEBOOK.jokers).length;

if(localStorage.getItem("modList") == null) localStorage.setItem("modList", "[]");
var   _modList         = JSON.parse(localStorage.getItem("modList"));
	
const modList = new Proxy(_modList, {
		set : (target, prop, value, receiver)=>{
			try {
				_modList[prop] = value
				localStorage.setItem("modList", JSON.stringify(_modList));
				_modList[prop];
				return true;
			} catch (error) {
				alert(error);
			}
		},
		get : (target, property, receiver )=>{
			try {
				_modList = JSON.parse(localStorage.getItem("modList"));
				let rg = _modList[property];
				return rg;
			} catch (error) {
				alert(error);
			}
		} 
	}
);

let isFirstTimeLoadingMods = true;
function rerenderModList(){
	modListElement.html("");
	if(JSON.parse(localStorage.getItem("modList")) == null) return;
	JSON.parse(localStorage.getItem("modList")).forEach(mod => {
		let modEntryElement = $("<li></li>");
		modEntryElement.text(mod);
		modListElement.append(modEntryElement);

		if(isFirstTimeLoadingMods){
			//Didn't work with jquery, so idk lol
			let scriptElement = document.createElement('script');
				scriptElement.src = mod;
			document.head.appendChild(scriptElement);
		}
	});
	

	if(isFirstTimeLoadingMods){
		//Give time to load.
		window.setTimeout(()=>{
			document.querySelector("footer").innerHTML += ` | <u> Mods : [ ${Object.keys(RULEBOOK.jokers).length - naturalJokers} Joker(s) added ] </u>`;
		}, 500);
	}

	isFirstTimeLoadingMods = false;
}
rerenderModList();

registerButton.on("click", ()=>{
	modList.push(prompt("Full name of mod file"));
	alert("Changes will be effective on next refresh.");
	rerenderModList();
});

unregisterButton.on("click", ()=>{
	try {
		function findMod(){
			let id = prompt("Full name of mod file to remove. \nIf it is not found, it will remove the last mod. \nTo exit, select cancel.").toString();
			let findResult = modList.findIndex((r)=>{return r==id});
			// alert(findResult)
			// alert(`${id} == ${modList[findResult]}`)

			return findResult;
		}
		modList.splice(findMod(),1);
		rerenderModList();
	} catch (error) {
		if(error.toString() == "TypeError: Cannot read properties of null (reading 'toString')") return;
		alert(`Click: `+error);
	}
});
