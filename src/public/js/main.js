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
let show_eye = document.querySelector(".fa-eye");
let show_eye_slash = document.getElementById("fa-eye-slash");
let passwordInput = document.getElementById("password-input");
show_eye?.addEventListener("click", () => {
	if (passwordInput.type === "password") {
		show_eye.style.display = "none";
		show_eye_slash.style.display = "block";
		passwordInput.type = "text";
	}
});
show_eye_slash?.addEventListener("click", () => {
	if (passwordInput.type === "text") {
		show_eye.style.display = "block";
		show_eye_slash.style.display = "none";
		passwordInput.type = "password";
	}
});
const copyBtn = document.querySelectorAll(".btn-copy");
copyBtn.forEach((item) => {
	item?.addEventListener("click", () => {
		const inputValue = document.querySelector(".voucherInput").value;
		navigator.clipboard
			.writeText(inputValue)
			.then(() => {
				Swal.fire({
					title: "Đã sao chép",
					icon: "success"
				});
			})
			.catch((err) => {
				Swal.fire({
					title: "Sao chép thất bại",
					icon: "error"
				});
			});
	});
});
