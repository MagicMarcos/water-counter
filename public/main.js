const price = document.querySelector('#waterAmount');
const output = document.querySelector('.price-output');

output.textContent = price.value;

price.addEventListener('input', function () {
	output.textContent = price.value;
});
// let dt = new Date();
// document.getElementById('date').innerHTML = d.toDate;

let trash = document.getElementsByClassName('fa-trash');

Array.from(trash).forEach(function (element) {
	element.addEventListener('click', function () {
		const time = this.parentNode.parentNode.childNodes[1].innerText;
		const waterAmount = this.parentNode.parentNode.childNodes[3].innerText;
		console.log('hi', typeof time, typeof waterAmount);
		const deleted = element.value;

		fetch('delete', {
			method: 'delete',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				deleteId: deleted,
			}),
		})
			.then(function (response) {
				if (response.ok) return response.json();
			})
			.then(data => window.location.reload());
	});
});

// document.getElementById('date').value = `${new Date()}`.slice(0, 15);

// console.log(`${new Date()}`.slice(0, 15));

let day = new Date()
	.toLocaleDateString()
	.replace('/', '-')
	.replace('/', '-')
	.split('-')
	.reverse();
let today = `${day[0]}-${day[2]}-${day[1]}`;
let presentDate = `${day[2]}-${day[1]}-${day[0]}`;
document.querySelector('.todayDate').innerText = presentDate;
// !target date input and set it's max and initial value to todays date
const val = document.querySelector('#date');
val.max = today;
val.value = today;
