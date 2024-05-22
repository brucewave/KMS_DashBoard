var parentAPI = 'http://152.42.238.98:8080/api/parent';
var childrenAPI = 'http://152.42.238.98:8080/api/children';
var userAPI = 'http://152.42.238.98:8080/api/user';
var teacherAPI = 'http://152.42.238.98:8080/api/teacher';
var classroomAPI = 'http://152.42.238.98:8080/api/classroom';

var addToClassroomAPI = function (teacherId, classroomId) {
  return `http://152.42.238.98:8080/api/teacher/${teacherId}/addToClass/${classroomId}`;
};


function start(token) {
  getParent(token, function (parent) {
    renderParent(token, parent);
  });

  getChildren(token, function (children) {
    getClassrooms(token, (classrooms) => {
      renderChildren(token, children, classrooms);
    });
  });

  getTeachers(token, (teachers) => {
    getClassrooms(token, (classrooms) => {
      renderTeachers(token, teachers, classrooms);
    });
  });
}


function getTeachers(token, callback) {
  fetch(teacherAPI, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then(callback);
}

function getClassrooms(token, callback) {
  fetch(classroomAPI, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then(callback)
}

function renderTeachers(token, teachers, classrooms) {

  const listTeacherTable = document.querySelector("#teacher-table");

  listTeacherTable.innerHTML = '';

  const headerRow = `
      <tr>
        <th>Họ tên</th>
        <th>Số điện thoại</th>
        <th>Email</th>
        <th>Địa chỉ</th>
        <th>Lớp giảng dạy</th>
        <th>Thao tác</th>
      </tr>
    `;

  listTeacherTable.innerHTML = headerRow;

  const teacherRows = teachers.map((teacher) => {
    const assignedClassroom = classrooms.find(
      (classroom) => classroom.teacherId === teacher.id
    );
    const assignedClassroomName = assignedClassroom ? assignedClassroom.name : '';

    return `
        <tr>
          <td>${teacher.fullName}</td>
          <td>${teacher.phoneNumber}</td>
          <td>${teacher.email}</td>
          <td>${teacher.address}</td>
          <td>
            <select id="classroom-${teacher.id}" class="form-select"">
              <option value="">-- Chọn lớp --</option>
              ${classrooms.map(
      (classroom) => `
                  <option value="${classroom.id}" ${assignedClassroomName === classroom.name ? 'selected' : ''}>
                    ${classroom.name}
                  </option>
                `
    ).join('')}
            </select>
          </td>
          <td>
          <div class="btn-group">
            <button data-teacher-id="${teacher.id}" class="btn btn-info">Cập nhật</button>
            <button onclick="handleDeleteTeacher('${token}', ${teacher.id})" class="btn btn-danger" ">Xóa</button>
            </div>
            </td>
            
            </tr>
            `;
  });

  // <button onclick="showTeacherReview(${teacher.id})" class="btn btn-primary">Xem đánh giá</button>
  listTeacherTable.innerHTML += teacherRows.join('');

  listTeacherTable.querySelectorAll('button.btn-info').forEach((updateButton) => {
    updateButton.addEventListener('click', (event) => {
      const teacherId = event.target.dataset.teacherId;
      const selectedClassroomId = event.target.closest('tr').querySelector(`#classroom-${teacherId}`).value;

      if (selectedClassroomId) {
        updateTeacherClassroom(token, teacherId, selectedClassroomId);
      } else {
        console.error('Vui lòng chọn lớp học');
      }
    });
  });



}


function updateTeacherClassroom(token, teacherId, classroomId) {
  const updateUrl = addToClassroomAPI(teacherId, classroomId);
  fetch(updateUrl, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        Toastify({
          text: "Cập nhật lớp học thành công!",
          duration: 5000,
          close: true,
          gravity: "top",
          position: "left",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          className: "success-toast",
        }).showToast();
        start(token);
      } else {
        Toastify({
          text: "Cập nhật lớp học thất bại!",
          duration: 5000,
          close: true,
          gravity: "top",
          position: "left",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
          className: "error-toast",
        }).showToast();
      }
    });
}

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
function renderChildren(token, children, classrooms) {
  var listChildrenBlock = document.querySelector("#children-table");

  var headerRow = `
      <tr>
        <th>Họ tên</th>
        <th>Tuổi</th>
        <th>Ngày sinh</th>
        <th>Chiều cao</th>
        <th>Cân nặng</th>
        <th>Giới tính</th>
        <th>Lớp học</th>
        <th>Thao tác</th>
      </tr>
    `;
  listChildrenBlock.innerHTML = headerRow;

  var htmls = children.map(function (child) {
    const assignedClassroom = classrooms.find(
      (classroom) => classroom.id === child.classroomId
    );
    const assignedClassroomName = assignedClassroom ? assignedClassroom.name : '';

    return `
        <tr>
          <td>${child.fullName}</td>
          <td>${child.age}</td>
          <td>${child.birthDay}</td>
          <td>${child.height}</td>
          <td>${child.weight}</td>
          <td>${child.gender ? 'Nam' : 'Nữ'}</td>
          <td>
            <select id="classroom-${child.id}" class="form-select">
              <option value="">-- Chọn lớp --</option>
              ${classrooms.map(
      (classroom) => `
                  <option value="${classroom.id}" ${assignedClassroomName === classroom.name ? 'selected' : ''}>
                    ${classroom.name}
                  </option>
                `
    ).join('')}
            </select>
          </td>
          <td>
            <button data-child-id="${child.id}" class="btn btn-info">Cập nhật</button>
          </td>
        </tr>
      `;
  });

  listChildrenBlock.innerHTML += htmls.join('');

  listChildrenBlock.addEventListener('click', (event) => {
    if (event.target.tagName !== 'BUTTON') return;

    const childId = event.target.dataset.childId;
    const selectedClassroomId = document.getElementById(`classroom-${childId}`).value;

    if (selectedClassroomId) {
      updateChildClassroom(token, childId, selectedClassroomId);
    } else {
      console.error('Vui lòng chọn lớp học');
    }
  });
}


//   Trả về lớp học
function updateChildClassroom(token, childId, classroomId) {
  const updateUrl = `http://152.42.238.98:8080/api/children/add/classroom`;

  const raw = JSON.stringify({
    "childIds": [
      childId
    ],
    "objectId": classroomId
  });


  fetch(updateUrl, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: raw
  })
    .then((response) => {
      if (response.ok) {
        Toastify({
          text: "Cập nhật lớp học thành công!",
          duration: 5000,
          close: true,
          gravity: "top",
          position: "left",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          className: "success-toast",
        }).showToast();
      } else {
        Toastify({
          text: "Cập nhật lớp học thất bại!",
          duration: 5000,
          close: true,
          gravity: "top",
          position: "left",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
          className: "error-toast",
        }).showToast();
      }
    });
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
  axios.delete(userAPI + '/' + id, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      Toastify({
        text: "Xóa thành công!",
        duration: 5000,
        close: true,
        gravity: "top",
        position: "left",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        className: "success-toast",
      }).showToast();
      start(token);
    })
}


function handleDeleteTeacher(token, id) {

  axios.delete(userAPI + '/' + id, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      Toastify({
        text: "Xóa thành công!",
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
      Toastify({
        text: "Chỉ được xóa giáo viên không có lớp, Hãy phân lớp cho giáo viên khác lớp này !",
        duration: 5000,
        close: true,
        gravity: "top",
        position: "left",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        className: "error-toast",
      }).showToast();
    });
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

//Form thêm bố mẹ
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
          <td><button onclick="handleDeleteParent('${token}', ${key.id})" class="btn btn-danger" ">Xóa</button></td>
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


function showTeacherReview(token, teacherId) {
  const reviewPopup = document.getElementById('reviewPopup');
  const reviewContent = document.getElementById('reviewContent');

  // Hiển thị popup
  reviewPopup.style.display = 'flex';

  // Xóa nội dung hiện tại
  reviewContent.innerHTML = '';

  // Gọi API để lấy thông tin đánh giá
  fetch(`http://152.42.238.98:8080/api/teacherComment/teacher/21`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // Thêm token vào đây nếu cần
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Không thể tải đánh giá từ máy chủ');
      }
      return response.json();
    })
    .then(data => {
      // Hiển thị thông tin đánh giá trong modal
      reviewContent.innerHTML = `
              <h2>${data.teacherName}</h2>
              <table>
                <tr>
                  <th>Điểm thái độ</th>
                  <th>Điểm sáng tạo</th>
                  <th>Ý kiến</th>
                </tr>
                <tr>
                  <td>${data.attitudeScore}</td>
                  <td>${data.creativeScore}</td>
                  <td>${data.comment}</td>
                </tr>
              </table>
          `;
    })
    .catch(error => {
      console.error('Lỗi khi tải đánh giá:', error);
      reviewContent.innerHTML = '<p>Không thể tải đánh giá</p>';
    });
}

function closePopup() {
  document.getElementById('reviewPopup').style.display = 'none';
}


