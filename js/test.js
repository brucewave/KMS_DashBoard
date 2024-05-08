// const { default: axios } = require("axios");

var parentAPI = 'http://localhost:9092/api/parent'
var childrenAPI = 'http://localhost:9092/api/children'
var userAPI = 'http://localhost:9092/api/user'

var teacherAPI = 'http://localhost:9092/api/teacher'
var classroomAPI = 'http://localhost:9092/api/classroom'

// var addToClassroomAPI = `http://localhost:9092/api/teacher/${teacherId}/addToClass/${classroomId}`;


function start(token) {
    getParent(token, function (parent) {
        renderParent(token, parent);
    });

    getChildren(token, function (children) {
        renderChildren(token, children);
    });

    handleCreateForm(token);

    // getTeachers(token, teachers => {
    //     getClassrooms(token, classrooms => {
    //         renderTeachers(token, teachers, classrooms);
    //     });
    // });


}


// // Hàm gọi API để lấy danh sách giáo viên
// function getTeachers(token, callback) {
//     fetch(teacherAPI, {
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//         }
//     })
//         .then(response => response.json())
//         .then(callback);
// }

// // Hàm gọi API để lấy danh sách lớp học
// function getClassrooms(token, callback) {
//     fetch(classroomAPI, {
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//         }
//     })
//         .then(response => response.json())
//         .then(callback);
// }

// // Hàm render danh sách giáo viên vào bảng
// function renderTeachers(token, teachers, classrooms) {
//     var teacherTable = document.getElementById('teacher-table').getElementsByTagName('tbody')[0];
//     teachers.forEach(teacher => {
//         var row = teacherTable.insertRow(-1);
//         row.insertCell(0).innerHTML = teacher.fullName;
//         row.insertCell(1).innerHTML = teacher.phoneNumber;
//         row.insertCell(2).innerHTML = teacher.birthDay;
//         row.insertCell(3).innerHTML = teacher.email;
//         var selectCell = row.insertCell(4);
//         var select = document.createElement('select');
//         classrooms.forEach(classroom => {
//             var option = document.createElement('option');
//             option.text = classroom.name;
//             option.value = classroom.id;
//             select.appendChild(option);
//         });
//         selectCell.appendChild(select);
//         row.insertCell(5).innerHTML = `<button onclick="updateTeacherClassroom('${token}', ${teacher.id}, this.parentNode.parentNode.cells[4].getElementsByTagName('select')[0])">Cập nhật</button>`;
//     });
// }

// function updateTeacherClassroom(token, teacherId, selectElement) {
//     var classroomId = selectElement.value; 
//     var addToClassroomAPI = `http://localhost:9092/api/teacher/${teacherId}/addToClass/${classroomId}`;

//     fetch(addToClassroomAPI, {
//         method: 'PUT',
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//         }
//     })
//         .then(response => {
//             if (response.ok) {
//                 alert('Cập nhật thành công!');
//                 selectElement.value = classroomId; // Cập nhật giá trị mặc định của select thành giá trị mới
//             } else {
//                 alert('Đã xảy ra lỗi khi cập nhật.');
//             }
//         })
//         .catch(error => {
//             console.error('Đã xảy ra lỗi:', error);
//         });
// }





//Gọi lớp
// function getClassroom(token, callback) {
//     fetch(classroomAPI, {
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//         }
//     })
//         .then(function (response) {
//             return response.json();
//         })
//         .then(callback);
// }

//Hiển thị lớp ra màn hình
// function renderClassroom(token, classroom) {
//     var listClassBlock = document.querySelector("#classroom-table tbody");
//     var htmls = classroom.map(function (key) {
//         var numberOfChildren = key.childIds.length; // Đếm số lượng trẻ trong lớp
//         return `
//         <tr>
//             <td>${key.name}</td>
//             <td>${numberOfChildren}</td>
//             <td>${key.teacherId}</td>
//             <td><button onclick="handleDeleteParent('${token}', ${key.id})">Xóa</button></td>
//         </tr>
//         `;
//     });
//     listClassBlock.innerHTML = htmls.join('');
// }


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

//Hiển thị trẻ
function renderChildren(token, children) {
    var listChildrenBlock = document.querySelector("#children-table");
  
    var headerRow = `
      <tr>
        <th>Họ tên</th>
        <th>Tuổi</th>  <th>Ngày sinh</th>
        <th>Chiều cao</th>
        <th>Cân nặng</th>
        <th>Giới tính</th>
        <th>Thao tác</th>
      </tr>
    `;
    listChildrenBlock.innerHTML = headerRow;  
  
    var htmls = children.map(function (key) {
        var genderText = key.gender ? 'Nam' : 'Nữ';
      return `
        <tr>
          <td>${key.fullName}</td>
          <td>${key.age}</td>
          <td>${key.birthDay}</td>
          <td>${key.height}</td>
          <td>${key.weight}</td>
          <td>${genderText}</td>
        </tr>
      `;
    });
  
    listChildrenBlock.innerHTML += htmls.join(''); 
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
    axios.delete(userAPI + '/' + id, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(res => {
            alert("Xóa thành công!")
        })
        .catch(err => {
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
            alert("Thêm thành công!");
        })
        .catch(function (error) {
            console.error('Error adding Parent and Child:', error);
        });
}



//Hiển thị bố mẹ ra màn hình
function renderParent(token, parent) {
    var listParentBlock = document.querySelector("#parent-table thead");
    var htmls = `
      <tr>
        <th>Họ tên</th>
        <th>SĐT</th>
        <th>Mật Khẩu</th>
        <th>Email</th>
        <th>Địa chỉ</th>
        <th>Thao Tác</th>
      </tr>
    `;

    listParentBlock.innerHTML = htmls;
  
    var tbody = document.querySelector("#parent-table tbody");
    htmls = parent.map(function (key) {
      return `
        <tr>
          <td>${key.fullName}</td>
          <td>${key.phoneNumber}</td>
          <td class="password">${maskPassword(key.password)}</td>
          <td>${key.email}</td>
          <td>${key.address}</td>
          <td><button onclick="handleDeleteParent('${token}', ${key.id})" class="p-2" style="border-radius: 15px; background-color: red; color: white; ">Xóa</button></td>
        </tr>
      `
    });
    tbody.innerHTML = htmls.join('');
  }


//Rút gọn mật khẩu
function maskPassword(password) {
    if (password.length > 10) {
        return password.substring(0, 7) + '...';
    } else {
        return password;
    }
}

//Form thêm user bố mẹ
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
        var gender = document.querySelector('input[name="gender"]:checked').value;
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
                gender: gender,
                hobby: hobby
            }
        };

        createParent(token, formData);
    };
}

