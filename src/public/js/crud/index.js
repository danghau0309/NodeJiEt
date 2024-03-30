function deleteItem(id) {
	fetch(`http://localhost:3000/api/data/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json"
		}
	})
		.then((res) => res.json())

		.catch((err) => console.error(err));
}

const apiDistrict = async () => {
	const res = await fetch(
		"https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
	);
	const data = await res.json();
	const city = document.getElementById("city");
	const district = document.getElementById("district");
	data.forEach((cityList) => {
		const { Name } = cityList;
		city.innerHTML += `<option value="${Name}">${Name}</option>`;
		cityList.Districts.forEach((inforDistrict) => {
			const { Name } = inforDistrict;
			district.innerHTML += `<option value="${Name}">${Name}</option>`;
		});
	});
};
apiDistrict();
