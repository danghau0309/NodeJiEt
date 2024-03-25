const iconUser = document.getElementById("icon-user");
const boxAuth = document.getElementById("box-auth");
const addCart = document.getElementById("addCart");
const notifi = document.getElementById("notifi");
const displayAuth = () => {
	boxAuth.classList.toggle("active");
};
iconUser.addEventListener("click", displayAuth);
if (addCart !== null) {
	addCart.addEventListener("click", () => {
		const valueInput = document.getElementById("valueInput").value;
		if (Number(valueInput) <= 0) {
			const waringMsg = document.createElement("div");
			waringMsg.classList.add("warningMiximum");
			waringMsg.innerHTML =
				"<i class='fa-solid fa-circle-exclamation'></i> Tối thiểu một sản phẩm";
			notifi.appendChild(waringMsg);
			setTimeout(() => {
				waringMsg.remove();
			}, 2000);
		}
	});
}
