// pull concurrent list from server
function getDataFromServer() {}
//render list
function renderBeerList() {
	const results = data.BEERMENU.map((items, index) => displayBeers(item);)
}
//display list to user
function displayBeers() {
	return `
	<div class="beer-select">
	<label id="beer-id" for="thumbnail">${BEERMENU[i].name}</label>
	<img src="${BEERMENU[i].img}" alt="${BEERMENU[i].alt}" name="thumbnail">
	<p class="beer-text">Brewery: ${BEERMENU[i].brewery}<span class="locale">(${BEERMENU[i].location})</span></p>
	<p class="beer-text">ABV: ${BEERMENU[i].ABV}</p>
	<p class="beer-text">IBU Rating: ${BEERMENU[i].bitterness}</p>
	<p class="beer-text">Best paired with: ${BEERMENU[i].pairing}</p>
	</div> 
	`
}
//listen for add
function listenForEvent() {
	$('.nav').on('click', '#add-beer', function(event) {
		selectNewOnTap();
	});
}
//if add, produce dropdown menu with beers already registered
function selectNewOnTap() {
	//toggle hidden class on beer list
}
//if new beer selected, redirect to new beer form.html
function listenForNewBeer() {

}
//add dropdown for concurrent beers
function selectTapToBeRemoved() {

}
// remove element
function removeElement() {

}
//callback for event listeners
function eventListener() {
	console.log('listening');
	listenForEvent();
}
//submit form to server on submit tap list
function sendUpdatedData() {
	
}