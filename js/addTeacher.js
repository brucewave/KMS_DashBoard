var parentAPI = 'http://157.10.44.240:8080/api/parent';
var childrenAPI = 'http://157.10.44.240:8080/api/children';
var userAPI = 'http://157.10.44.240:8080/api/user';
// var teacherAPI = 'http://157.10.44.240:8080/api/teacher';
var classroomAPI = 'http://157.10.44.240:8080/api/classroom';


function start(token) {
    handleCreateTeacherForm(token);

    getTeachers(token, (teachers) => {
        getClassrooms(token, (classrooms) => {
            renderTeachers(token, teachers, classrooms);
        });
    });
}


function getTeachers(token, callback) {
    fetch(userAPI, {
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
        .then(callback);
}

function renderTeachers(token, teachers, classrooms) {
    const listTeacherTable = document.querySelector("#teacher-tableee");

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
            <select id="classroom-${teacher.id}">
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
            <button data-teacher-id="${teacher.id}" class="btn">Cập nhật</button>
          </td>
        </tr>
      `;
    });

    listTeacherTable.innerHTML += teacherRows.join('');

    // Handle update button click event
    listTeacherTable.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (event) => {
            const teacherId = event.target.dataset.teacherId;
            const selectedClassroomId = document.getElementById(`classroom-${teacherId}`).value;

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
                alert("Cập nhật thành công!")
            } else {
                console.error('Cập nhật lớp học thất bại');
            }
        });
}

//Tạo giáo viên
function createTeacher(token, data) {
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    };
    fetch(userAPI, options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function (data) {
            console.log('Teacher added:', data);
            alert("Thêm thành công!");
        })
        .catch(function (error) {
            console.error('Error adding Teacher:', error);
        });

}

//Form thêm giáo viên
function handleCreateTeacherForm(token) {
    var creatBtn = document.querySelector('#addTeacher');
    creatBtn.onclick = function () {
        var fullName = document.querySelector('input[name="fullName"]').value;
        var phoneNumber = document.querySelector('input[name="phoneNumber"]').value;
        var password = document.querySelector('input[name="password"]').value;
        var email = document.querySelector('input[name="email"]').value;
        var address = document.querySelector('input[name="address"]').value;

        var formData = {
            fullName: fullName,
            phoneNumber: phoneNumber,
            password: password,
            email: email,
            address: address
        };
        createTeacher(token, formData);
    };
}