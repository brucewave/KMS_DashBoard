var postAPI = 'http://152.42.238.98:8080/api/post';

function start(token) {
    handleCreatePostForm(token);
    getPost(token, posts => renderPost(token, posts));
}

function getPost(token, callback) {
    fetch(postAPI, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(response => response.json())
        .then(callback)
        .catch(error => console.error('Error fetching posts:', error));
}

function renderPost(token, posts) {
    const PostTable = document.querySelector("#post-table tbody");
    PostTable.innerHTML = ''; // Clear the current content

    posts.forEach(post => {
        const tr = document.createElement('tr');

        // Create title column
        const tdTitle = document.createElement('td');
        tdTitle.textContent = post.title;
        tr.appendChild(tdTitle);

        // Create content column
        const tdContent = document.createElement('td');
        tdContent.textContent = post.content;
        tr.appendChild(tdContent);

        // Create image column (display image name)
        const tdImage = document.createElement('td');
        if (post.image) {
            const filename = post.image.split('/').pop();
            tdImage.textContent = filename;
        } else {
            tdImage.textContent = 'No Image';
        }
        tr.appendChild(tdImage);

        // Create action column
        const tdAction = document.createElement('td');
        
        // Create button group div
        const buttonGroup = document.createElement('div');
        buttonGroup.classList.add('btn-group');

        // Create edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Sửa';
        editButton.classList.add('btn', 'btn-info');
        editButton.dataset.postId = post.id; // Set post ID as dataset for later reference
        editButton.addEventListener('click', () => handleEditPostModal(token, post.id));

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Xóa';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.addEventListener('click', () => handleDeletePost(token, post.id));

        // Append buttons to button group
        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(deleteButton);

        // Append button group to action column
        tdAction.appendChild(buttonGroup);

        tr.appendChild(tdAction);

        // Append the row to the table
        PostTable.appendChild(tr);
    });
}



function handleDeletePost(token, id) {
    axios.delete(`${postAPI}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(res => {
            Toastify({
                text: "Xóa bài viết thành công!",
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
                text: "Xóa bài viết không thành công!",
                duration: 5000,
                close: true,
                gravity: "top",
                position: "left",
                backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                className: "error-toast",
            }).showToast();
        });
}

// Create post function
function createPost(token, formData) {
    axios.post(postAPI, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            // Xóa nội dung hiện tại của các ô tiêu đề, nội dung và ảnh
            document.querySelector('input[name="title"]').value = '';
            document.querySelector('input[name="descript"]').value = '';
            document.querySelector('input[name="image"]').value = '';

            // Hiển thị thông báo thành công
            Toastify({
                text: "Thêm bài viết thành công!",
                duration: 5000,
                close: true,
                gravity: "top",
                position: "left",
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                className: "success-toast",
            }).showToast();

            // Tải lại danh sách bài viết
            start(token);
        })
        .catch(error => {
            console.error('Error adding Notice:', error);
            // Hiển thị thông báo lỗi
            Toastify({
                text: "Thêm bài viết thất bại!",
                duration: 5000,
                close: true,
                gravity: "top",
                position: "left",
                backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                className: "error-toast",
            }).showToast();
        });
}


// Handle form submission
function handleCreatePostForm(token) {
    var createBtn = document.querySelector('#send-post');
    createBtn.onclick = function () {
        var title = document.querySelector('input[name="title"]').value;
        var content = document.querySelector('input[name="descript"]').value;
        var fileInput = document.querySelector('input[name="image"]');

        var formData = new FormData();
        formData.append("image", fileInput.files[0]);
        formData.append("title", title);
        formData.append("content", content);

        createPost(token, formData);
    };
}


// function handleEditPostModal(token, postId) {
//     // Fetch post data by postId
//     fetch(`${postAPI}/${postId}`, {
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`,
//         },
//     })
//         .then(response => response.json())
//         .then(post => {
//             // Populate modal with post data for editing
//             const postPopup = document.getElementById("postPopup");
//             const reviewContent = document.getElementById("reviewContent");

//             // Clear previous content
//             reviewContent.innerHTML = '';

//             // Create input fields for editing post
//             const titleInput = document.createElement('input');
//             titleInput.type = 'text';
//             titleInput.value = post.title;
//             titleInput.classList.add('form-control', 'mb-3');
//             reviewContent.appendChild(titleInput);

//             const contentInput = document.createElement('textarea');
//             contentInput.value = post.content;
//             contentInput.classList.add('form-control', 'mb-3');
//             reviewContent.appendChild(contentInput);

//             const imageInput = document.createElement('input');
//             imageInput.type = 'file'; // Change to file input if image editing is allowed
//             imageInput.classList.add('form-control', 'mb-3');
//             reviewContent.appendChild(imageInput);

//             // Show modal
//             postPopup.style.display = "block";
//         })
//         .catch(error => console.error('Error fetching post:', error));
// }

function createInputField(type, value, label) {
    const container = document.createElement('div'); 
    container.classList.add('mb-3'); 

    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    container.appendChild(labelElement);

    // Kiểm tra loại trường nhập
    if (type === 'textarea') {
        const inputField = document.createElement('textarea');
        inputField.value = value;
        inputField.classList.add('form-control'); 
        container.appendChild(inputField);
    } else {
        const inputField = document.createElement('input');
        inputField.type = type;
        inputField.value = value;
        inputField.classList.add('form-control');
        container.appendChild(inputField);
    }

    return container;
}


function handleUpdatePost(token, postId, formData) {
    // Check if a new image file is included in the formData
    const hasNewImage = formData.has('image');
    // Gửi yêu cầu cập nhật bài viết đến API
    axios.put(`${postAPI}/${postId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            // Đóng modal sau khi cập nhật thành công
            document.getElementById("postPopup").style.display = "none";
            // Hiển thị bài viết thành công
            Toastify({
                text: "Cập nhật bài viết thành công!",
                duration: 5000,
                close: true,
                gravity: "top",
                position: "left",
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                className: "success-toast",
            }).showToast();
            // Tải lại danh sách bài viết
            start(token);
        })
        .catch(error => {
            console.error('Lỗi khi cập nhật bài viết:', error);
            // Hiển thị bài viết lỗi
            Toastify({
                text: "Cập nhật bài viết thất bại!",
                duration: 5000,
                close: true,
                gravity: "top",
                position: "left",
                backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                className: "error-toast",
            }).showToast();
        });
}

function handleEditPostModal(token, postId) {
    // Fetch dữ liệu bài viết bằng postId
    fetch(`${postAPI}/${postId}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(response => response.json())
        .then(post => {
            // Hiển thị modal với dữ liệu bài viết cho việc chỉnh sửa
            const postPopup = document.getElementById("postPopup");
            const reviewContent = document.getElementById("reviewContent");

            // Xóa nội dung trước đó
            reviewContent.innerHTML = '';

            // Tạo các trường nhập để chỉnh sửa bài viết
            const titleInput = createInputField('text', post.title, 'Tiêu Đề');
            reviewContent.appendChild(titleInput);

            const contentInput = createInputField('textarea', post.content, 'Nội Dung');
            reviewContent.appendChild(contentInput);

            const imageContainer = document.createElement('div'); // Tạo container cho hình ảnh và tên file

            const imageInput = createInputField('file', null, 'Hình ảnh:'); // Không có giá trị cho trường file input
            imageInput.classList.remove('form-control'); // Loại bỏ class form-control để điều chỉnh kiểu dáng cho trường file input
            imageInput.style.marginBottom = '1rem'; // Thêm margin bottom để tạo khoảng cách

            // Hiển thị tên file hình ảnh hiện tại (nếu có)
            if (post.image) {
                const filename = post.image.split('/').pop();
                const filenameElement = document.createElement('span');
                filenameElement.textContent = `Hình ảnh: ${filename}`;
                imageContainer.appendChild(filenameElement);
            }

            imageContainer.appendChild(imageInput);
            reviewContent.appendChild(imageContainer);

            // Tạo nút cập nhật
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Cập nhật';
            updateButton.classList.add('btn', 'btn-primary', 'mb-3');
            updateButton.addEventListener('click', () => {
                const formData = new FormData();
                formData.append('title', titleInput.querySelector('input').value);
                formData.append('content', contentInput.querySelector('textarea').value);
                if (imageInput.querySelector('input').files.length > 0) {
                    formData.append('image', imageInput.querySelector('input').files[0]);
                }
                handleUpdatePost(token, postId, formData);
            });
            reviewContent.appendChild(updateButton);

            // Hiển thị modal
            postPopup.style.display = "block";
        })
        .catch(error => console.error('Lỗi khi lấy dữ liệu bài viết:', error));
}

function closePopup() {
    document.getElementById("postPopup").style.display = "none";
}


