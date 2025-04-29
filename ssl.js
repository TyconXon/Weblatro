/* START Sugar Shaders Library */
const ssl = {
	options : {},
	shaders : {},
};

try{
	
ssl.options.chromaticabbr = {};
ssl.options.chromaticabbr.intensity = 1;
	
}catch(error){
	alert('SSL: Error initializing options!!! ' + error);
}

try{

ssl.shaders.chromaticabbr = `<svg width="0" height="0">
  <filter id="kill">
    <feColorMatrix type="matrix" result="red_" values="4 0 0 0 0
              0 0 0 0 0 
              0 0 0 0 0 
              0 0 0 1 0"></feColorMatrix>
    <feOffset in="red_" dx="${3*ssl.options.chromaticabbr.intensity}" dy="0" result="red"></feOffset>
    <feColorMatrix type="matrix" in="SourceGraphic" result="blue_" values="0 0 0 0 0
              0 3 0 0 0 
              0 0 10 0 0 
              0 0 0 1 0"></feColorMatrix>
    <feOffset in="blue_" dx="${-4*ssl.options.chromaticabbr.intensity}" dy="0" result="blue"></feOffset>    
    <feBlend mode="screen" in="red" in2="blue"></feBlend>

  </filter>
</svg>`;

ssl.shaders.glass = `<svg width="200" height="200" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
  <filter id="displacementFilter">
    <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence"></feTurbulence>
    <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
  </filter>
</svg>`;

ssl.shaders.wonky = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <defs>
    <filter id="noise">
      <feTurbulence type="fractalNoise" id="turbulence" baseFrequency="0.002" numOctaves="3" result="noise" seed="0"></feTurbulence>
      <feDisplacementMap id="displacement" in="SourceGraphic" in2="noise" scale="300"></feDisplacementMap>
    </filter> 
    
    <filter id="contrast">;
      <feColorMatrix in="SourceGraphic" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -10" result="matrix"></feColorMatrix>
      <feComposite in="SourceGraphic" in2="matrix" operator="atop"></feComposite> 
    </filter>
  </defs>
</svg>`;

ssl.shaders.glitch = `<svg width="0" height="0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>          
        <filter id="glitch" x="-10%" y="-10%" width="120%" height="120%" filterUnits="objectBoundingBox">
          <feFlood flood-color="cyan" result="cyan"/>
          <feFlood flood-color="magenta" result="magenta"/>
          <feFlood flood-color="yellow" result="yellow"/>

          <feFlood flood-color="rgb(188,188,188)" flood-opacity=".5" x="0%" y="0%" width="100%" height="50%" result="neutral-tile"/>
          <feFlood flood-color="rgb(0,188,188)" flood-opacity=".5" x="0%" y="50%" width="100%" height="50%" result="displacement-tile"/>
          <feMerge result="square">
            <feMergeNode in="neutral-tile"/>
            <feMergeNode in="displacement-tile"/>
          </feMerge>

          <feDisplacementMap in2="square" in="SourceGraphic" scale="10" xChannelSelector="R" yChannelSelector="A" result="displacement"/>

          <feComposite in="cyan" in2="displacement" operator="in" result="text-cyan"/>
          <feComposite in="magenta" in2="displacement" operator="in" result="text-magenta"/>
          <feComposite in="yellow" in2="displacement" operator="in" result="text-yellow"/>

          <feOffset result="text-cyan-offset" in="text-cyan" dx="-4" dy="2" />
          <feOffset result="text-magenta-offset" in="text-magenta" dx="1" dy="4" />
          <feOffset result="text-yellow-offset" in="text-yellow" dx="2" dy="-1" />

          <feBlend in="text-cyan-offset" in2="text-magenta-offset" result="blend-cyan-magenta" mode="screen"/>
          <feBlend in="blend-cyan-magenta" in2="text-yellow-offset" result="blend-cyan-magenta-yellow" mode="screen"/>
        </filter>
      </defs>
    </svg>`;

ssl.shaders.pixel = `<svg style="position: fixed;">
	<filter id="pixelate-mosaic" x="0%" y="0%" width="100%" height="100%">
		<!--Thanks to Zoltan Fegyver for figuring out pixelation and producing the awesome pixelation map. -->
		<feGaussianBlur stdDeviation="2" in="SourceGraphic" result="smoothed"></feGaussianBlur>
		<feImage width="15" height="15" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAIAAAACDbGyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAWSURBVAgdY1ywgOEDAwKxgJhIgFQ+AP/vCNK2s+8LAAAAAElFTkSuQmCC" result="displacement-map"></feImage>
		<feTile in="displacement-map" result="pixelate-map"></feTile>
		<feDisplacementMap in="smoothed" in2="pixelate-map" xChannelSelector="R" yChannelSelector="G" scale="50" result="pre-final"></feDisplacementMap>
		<feComposite operator="in" in2="SourceGraphic"></feComposite>
	</filter>
	
	<filter id="pixelate" x="0" y="0">
		<feFlood x="4" y="4" height="2" width="2"></feFlood>

		<feComposite width="10" height="10"></feComposite>

		<feTile result="a"></feTile>

		<feComposite in="SourceGraphic" in2="a" operator="in"></feComposite>

		<feMorphology operator="dilate" radius="5"></feMorphology>
	</filter>

</svg>`;
ssl.shaders.duotone = `<svg viewBox="0 0 266 400">
    <filter id="duotone">
        <!-- Grab the SourceGraphic (implicit) and convert it to grayscale -->
        <feColorMatrix type="matrix" values=".33 .33 .33 0 0
              .33 .33 .33 0 0
              .33 .33 .33 0 0
              0 0 0 1 0">
        </feColorMatrix>

        <!-- Map the grayscale result to the gradient map provided in tableValues -->
        <feComponentTransfer color-interpolation-filters="sRGB">
            <feFuncR type="table" tableValues="0  1  0.1"></feFuncR>
            <feFuncG type="table" tableValues="1  0  0"></feFuncG>
            <feFuncB type="table" tableValues="1  0  0"></feFuncB>
        </feComponentTransfer>
    </filter>
</svg>`;

ssl.shaders.paint = `<svg width="450" height="300" viewBox="0 0 450 300">
    <filter id="erode">
      <feMorphology operator="erode" radius="1"></feMorphology>
    </filter>
</svg>`;
//  https://tympanus.net/codrops/2019/02/05/svg-filter-effects-duotone-images-with-fecomponenttransfer/
  
ssl.shaders.holographic = `<svg viewBox="0 0 266 400">
    <filter id="holographic">
      <feImage xlink:href="./img/dumbFire.gif" width="500" height="500" x="0" y="0" preserveAspectRatio="xMidYMid meet" crossOrigin="anonymous" result="image"/>
      
    </filter>
</svg>`;

ssl.shaders.negative = `<svg><filter id="negative" color-interpolation-filters="linearRGB" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
 <feConvolveMatrix order="3 3" kernelMatrix="-3 0 0 
0 -3 0 
0 0 4" divisor="1" bias="1" targetX="0" targetY="0" edgeMode="duplicate" preserveAlpha="true" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" result="convolveMatrix"/>
 <feBlend mode="color-burn" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" in2="colormatrix" result="blend1"/>
</filter>
</svg>`;

ssl.shaders.polychrome = `<svg><filter id="polychrome" color-interpolation-filters="linearRGB" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
 <feTurbulence type="fractalNoise" baseFrequency="0.035 0.03" numOctaves="1" seed="2" stitchTiles="stitch" result="turbulence"/>
 <feTurbulence type="fractalNoise" baseFrequency="0.035 0.012" numOctaves="1" seed="1" stitchTiles="stitch" result="turbulence1"/>
 <feMerge result="merge">
  <feMergeNode in="SourceGraphic" result="mergeNode"/>
  <feMergeNode in="turbulence" result="mergeNode1"/>
 </feMerge>
 <feColorMatrix type="saturate" values="10" in="merge" result="colormatrix"/>
 <feColorMatrix type="matrix" values="1 0 0 0 0
0 1 0 0 0
0 0 1 0 0
0 0 0 10 0" in="colormatrix" result="colormatrix1"/>
 <feDisplacementMap in="colormatrix1" in2="colormatrix" scale="40" xChannelSelector="R" yChannelSelector="G" result="displacementMap"/>
 <feComposite in="displacementMap" in2="SourceAlpha" operator="in" result="composite1"/>
 <feColorMatrix type="matrix" values="1 0 0 0 0
0 1 0 0 0
0 0 1 0 0
0 0 0 .5 0" x="0%" y="0%" width="100%" height="100%" in="composite1" result="colormatrix3"/>
 <feBlend mode="luminosity" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" in2="colormatrix3" result="blend2"/>
</filter></svg>`;

ssl.shaders.foil = `<svg><filter id="foil" color-interpolation-filters="linearRGB" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
 <feColorMatrix type="matrix" values="0.1 0 0 0 0
0 .85 0 0 0
0 0 5 0 0
0 0 0 1 0" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" result="colormatrix"/>
 <feMorphology operator="dilate" radius="3 3" x="0%" y="0%" width="100%" height="100%" in="colormatrix" result="morphology"/>
 <feBlend mode="hard-light" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" in2="morphology" result="blend1"/>
</filter></svg>`

}catch(error){
	alert('SSL: Error with shader data!!! '+ error);
}

try{


for(var shaderProp in ssl.shaders){
	shader = ssl.shaders[shaderProp];
	var s = document.createElement('div');
	s.innerHTML = shader;
	s.setAttribute('nodraw', 'true');
	document.body.appendChild(s);
};

}catch(error){
	alert('SSL: Error appending shaders!!! ' + error);
}

/* END Sugar Shaders Library */