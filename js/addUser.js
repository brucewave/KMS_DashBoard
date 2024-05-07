document.addEventListener("DOMContentLoaded", function () {
    const addParentForm = document.getElementById("add-parent-form");

    addParentForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của form

        // Lấy dữ liệu từ form
        const fullName = document.getElementById("fullName").value;
        const phoneNumber = document.getElementById("phoneNumber").value;
        const password = document.getElementById("password").value;
        const email = document.getElementById("email").value;
        const address = document.getElementById("address").value;

        // Tạo đối tượng chứa dữ liệu
        const userData = {
            fullName: fullName,
            phoneNumber: phoneNumber,
            password: password,
            email: email,
            address: address
        };

        // Gửi dữ liệu lên máy chủ để thêm mới
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcxNTAxMDIwOSwiZXhwIjoxNzE1NjE1MDA5fQ.3bOJy8Yfhj1LEaorQhtWhkH87k8gbPd9b_W-0YpV_etqW2d21PeaySnv36RHrzum"
            },
            body: JSON.stringify(userData),
            redirect: "follow"
        };

        fetch("http://localhost:9092/api/parent", requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error adding parent');
                }
                return response.json();
            })
            .then(data => {
                console.log('Parent added successfully:', data);
                window.location.href = "user.html";
            })
            .catch(error => console.error('Error adding parent:', error));
    });
});
