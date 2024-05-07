// const { default: axios } = require("axios");

var parentAPI = 'http://localhost:9092/api/parent'
var childrenAPI = 'http://localhost:9092/api/children'

function start(token) {
    getParent(token, function(parent) {
        renderParent(token, parent);
    });

    getChildren(token, function(children) {
        renderChildren(token, children);
    });
}


//Gọi trẻ
function getChildren(token, callback) {
    fetch(childrenAPI, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(callback);
}


//Hiển thị trẻ ra màn hình
function renderChildren(token,children) {
    var listChildrenBlock = document.querySelector("#children-table");
    var htmls = children.map(function (key) {
        return `
        <tr>
            <td>${key.fullName}</td>
            <td>${key.age}</td>
            <td>${key.birthDay}</td>
            <td>${key.height}</td>
            <td>${key.weight}</td>
            <td>${key.gender}</td>
            <td>${key.parentId}</td>
            <td>${key.teacherId}</td>
            <td>${key.classroomId}</td>
            <td><button onclick="handleDeleteParent('${token}', ${key.id})">Xóa</button></td>
        </tr>
        `
    });
    listChildrenBlock.innerHTML = htmls.join('');
}


//Gọi bố mẹ
function getParent(token, callback) {
    fetch(parentAPI, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(callback);
}

//Xóa bố mẹ
function handleDeleteParent(token, id) {
    // var options = {
    //     method: 'DELETE',
    //     headers: {
    //         'Authorization': `Bearer ${token}`
    //     }
    // };

    // fetch(parentAPI + '/' + id, options)
    //     .then(function (response) {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then(function () {
    //         getParent(token, renderParent);
    //     })
    //     .catch(function (error) {
    //         console.error('Error Delete Parent and Child:', error);
    //     });
    axios.delete(parentAPI + '/' + id, {
        headers:{
            Authorization:  `Bearer ${token}`
        }
    })
    .then(res=>{
        alert("delete")
    })
    .catch(err=>{
        alert(err)
    })
}


//Tạo bố mẹ
function createParent(token, data) {
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    };

    fetch(parentAPI, options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function (data) {
            console.log('Parent and Child added:', data);
        })
        .catch(function (error) {
            console.error('Error adding Parent and Child:', error);
        });
}



//Hiển thị bố mẹ ra màn hình
function renderParent(token,parent) {
    var listParentBlock = document.querySelector("#parent-table");
    var htmls = parent.map(function (key) {
        return `
        <tr>
        <td>${key.fullName}</td>
        <td>${key.phoneNumber}</td>
        <td class="password">${maskPassword(key.password)}</td>
        <td>${key.email}</td>
        <td>${key.address}</td>
        <td><button onclick="handleDeleteParent('${token}', ${key.id})">Xóa</button></td>
        </tr>
        `
    });
    listParentBlock.innerHTML = htmls.join('');
}


//Rút gọn mật khẩu
function maskPassword(password) {
    if (password.length > 10) {
        return password.substring(0, 7) + '...';
    } else {
        return password;
    }
}

//Form thêm user
function handleCreateForm(token) {
    var creatBtn = document.querySelector('#create');

    creatBtn.onclick = function () {
        var fullName = document.querySelector('input[name="fullName"]').value;
        var phoneNumber = document.querySelector('input[name="phoneNumber"]').value;
        var password = document.querySelector('input[name="password"]').value;
        var email = document.querySelector('input[name="email"]').value;
        var address = document.querySelector('input[name="address"]').value;
        var fullNameChild = document.querySelector('input[name="fullNameChild"]').value;
        var age = document.querySelector('input[name="age"]').value;
        var birthDay = document.querySelector('input[name="birthDay"]').value;
        var height = document.querySelector('input[name="height"]').value;
        var weight = document.querySelector('input[name="weight"]').value;
        var gender = document.querySelector('input[name="gender"]').value;
        var hobby = document.querySelector('input[name="hobby"]').value;

        var formData = {
            userDTO: {
                fullName: fullName,
                phoneNumber: phoneNumber,
                password: password,
                email: email,
                address: address
            },
            childDTO: {
                fullName: fullNameChild,
                age: parseInt(age),
                birthDay: birthDay,
                height: parseInt(height),
                weight: parseInt(weight),
                gender: (gender === 'true'),
                hobby: hobby
            }
        };

        createParent(token, formData);
    };
}

