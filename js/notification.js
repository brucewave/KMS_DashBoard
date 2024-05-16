var notiAPI = 'http://157.10.44.240:8080/api/notification';

function start(token) {
    handleCreateNotificationForm(token);

    getNotification(token, notifications => renderNoti(token, notifications));
}

function getNotification(token, callback) {
    fetch(notiAPI, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
    .then((response) => response.json())
    .then(callback);
}

function renderNoti(token, notifications) {
    const notificationTable = document.querySelector("#table-notifi tbody");
    notificationTable.innerHTML = ''; // Xóa hết nội dung hiện tại của bảng

    notifications.forEach(notification => {
        const tr = document.createElement('tr');

        // Tạo cột biểu tượng
        const tdIcon = document.createElement('td');
        tdIcon.innerHTML = `
            <svg class="bgl-success tr-icon" width="63" height="63"
                viewBox="0 0 63 63" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g>
                    <path
                        d="M35.2219 42.9875C34.8938 42.3094 35.1836 41.4891 35.8617 41.1609C37.7484 40.2531 39.3453 38.8422 40.4828 37.0758C41.6477 35.2656 42.2656 33.1656 42.2656 31C42.2656 24.7875 37.2125 19.7344 31 19.7344C24.7875 19.7344 19.7344 24.7875 19.7344 31C19.7344 33.1656 20.3523 35.2656 21.5117 37.0813C22.6437 38.8477 24.2461 40.2586 26.1328 41.1664C26.8109 41.4945 27.1008 42.3094 26.7727 42.993C26.4445 43.6711 25.6297 43.9609 24.9461 43.6328C22.6 42.5063 20.6148 40.7563 19.2094 38.5578C17.7656 36.3047 17 33.6906 17 31C17 27.2594 18.4547 23.743 21.1016 21.1016C23.743 18.4547 27.2594 17 31 17C34.7406 17 38.257 18.4547 40.8984 21.1016C43.5453 23.7484 45 27.2594 45 31C45 33.6906 44.2344 36.3047 42.7852 38.5578C41.3742 40.7508 39.3891 42.5063 37.0484 43.6328C36.3648 43.9555 35.55 43.6711 35.2219 42.9875Z"
                        fill="#2BC155"></path>
                    <path
                        d="M36.3211 31.7274C36.5891 31.9953 36.7203 32.3453 36.7203 32.6953C36.7203 33.0453 36.5891 33.3953 36.3211 33.6633L32.8812 37.1031C32.3781 37.6063 31.7109 37.8797 31.0055 37.8797C30.3 37.8797 29.6273 37.6008 29.1297 37.1031L25.6898 33.6633C25.1539 33.1274 25.1539 32.2633 25.6898 31.7274C26.2258 31.1914 27.0898 31.1914 27.6258 31.7274L29.6437 33.7453L29.6437 25.9742C29.6437 25.2196 30.2562 24.6071 31.0109 24.6071C31.7656 24.6071 32.3781 25.2196 32.3781 25.9742L32.3781 33.7508L34.3961 31.7328C34.9211 31.1969 35.7852 31.1969 36.3211 31.7274Z"
                        fill="#2BC155"></path>
                </g>
            </svg>
        `;
        tr.appendChild(tdIcon);

        // Tạo cột tiêu đề và nội dung
        const tdTitle = document.createElement('td');
        tdTitle.innerHTML = `
            <h6 class="fs-16 font-w600 mb-0"><a class="text-black">${notification.title}</a></h6>
            <span class="fs-14">${notification.content}</span>
        `;
        tr.appendChild(tdTitle);

        // Tạo cột ngày và giờ
        const tdDate = document.createElement('td');
        const date = new Date(...notification.postDate);
        tdDate.innerHTML = `
            <h6 class="fs-16 text-black font-w600 mb-0">${date.toLocaleDateString()}</h6>
            <span class="fs-14">${date.toLocaleTimeString()}</span>
        `;
        tr.appendChild(tdDate);

        // Tạo cột hành động
        const tdAction = document.createElement('td');
        tdAction.innerHTML = `
            <span class="btn btn-danger btn-lg text-uppercase shadow">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7zM4.118 1.642A1.5 1.5 0 0 1 5.5 1h5a1.5 1.5 0 0 1 1.382.642L12.5 2H15a.5.5 0 0 1 0 1h-1v10.5A1.5 1.5 0 0 1 12.5 15h-9a1.5 1.5 0 0 1-1.5-1.5V3H1a.5.5 0 0 1 0-1h2.5l.618-.358zM4.118 2.5 3.5 3h9l-.618-.5H4.118zM5.5 4a.5.5 0 0 0-.5.5v8A1.5 1.5 0 0 0 6.5 14h3a1.5 1.5 0 0 0 1.5-1.5v-8a.5.5 0 0 0-.5-.5h-4z"/>
                </svg>
            </span>
        `;
        tdAction.addEventListener('click', () => {
            handleDeleteNotification(token, notification.id);
        });
        tr.appendChild(tdAction);

        notificationTable.appendChild(tr);
    });
}

function handleDeleteNotification(token, id) {
    axios.delete(`${notiAPI}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => {
        Toastify({
            text: "Xóa thông báo thành công!",
            duration: 5000,
            close: true,
            gravity: "top",
            position: "left",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
            className: "success-toast",
        }).showToast();
        start(token);
    })
    .catch(err => {
        console.error(err);
        Toastify({
            text: "Xóa thông báo không thành công!",
            duration: 5000,
            close: true,
            gravity: "top",
            position: "left",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
            className: "error-toast",
        }).showToast();
    });
}

//Tạo thông báo
function createNotification(token, data) {
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    };
    fetch(notiAPI, options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function (data) {
            Toastify({
                text: "Thêm thông báo thành công!",
                duration: 5000,
                close: true,
                gravity: "top",
                position: "left",
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                className: "success-toast",
            }).showToast();
            start(token);
        })
        .catch(function (error) {
            console.error('Error adding Notice:', error);
            Toastify({
                text: "Thêm thông báo thất bại!",
                duration: 5000,
                close: true,
                gravity: "top",
                position: "left",
                backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                className: "error-toast",
            }).showToast();
        });

}

//Form thêm thông báo
function handleCreateNotificationForm(token) {
    var creatBtn = document.querySelector('#send-notice');
    creatBtn.onclick = function () {
        var title = document.querySelector('input[name="title"]').value;
        var content = document.querySelector('input[name="descript"]').value;

        var formData = {
            title: title,
            content: content
        };
        createNotification(token, formData);
    };
}