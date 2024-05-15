document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-login");
    const emailInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Gửi yêu cầu POST đến API
        fetch("http://157.10.44.240:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                phoneNumberOrEmail: email,
                password: password,
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Thông tin tài khoản hoặc mật khẩu không đúng.');
                }
                return response.json();
            })
            .then(data => {
                // Lưu token vào localStorage
                localStorage.setItem("accessToken", data.accessToken);
                // Thêm token vào header cho các yêu cầu sau này
                const token = localStorage.getItem("accessToken");
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                };
                // Chuyển hướng đến trang index.html
                window.location.href = "index.html";
            })
            .catch(error => {
                alert(error.message); // Hiển thị thông báo lỗi
            });
    });

});



