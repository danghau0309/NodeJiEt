const cdnIcon =
	'<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">';
const linkCss = '<link rel="stylesheet" href="/css/style.css">';
const waring = `<head>${cdnIcon} ${linkCss}</head>
                <div class="toast-waring">
                    <h1><i class="fa-solid fa-circle-exclamation"></i></h1>
                </div>`;
const success = "Thành công";
module.exports = {
	waring,
	success
};
