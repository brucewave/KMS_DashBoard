document.addEventListener("DOMContentLoaded", function () {
    // Check Token
    const token = localStorage.getItem("accessToken");
    if (!token) {
        window.location.href = "login.html";
    } else {
    // Get Data
        fetchDataWithToken(token);
    }
});

function fetchDataWithToken(token) {
    // Data Teacher
    fetch('http://157.10.44.240:8080/api/teacher', {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching teachers');
            }
            return response.json();
        })
        .then(data => {
            const totalTeachers = data.length;
            document.getElementById('total-teachers').textContent = totalTeachers;
        })
        .catch(error => console.error('Error fetching teachers:', error));

    // Data Parent
    fetch('http://157.10.44.240:8080/api/parent', {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching Parent');
            }
            return response.json();
        })
        .then(data => {
            const totalParent = data.length;
            document.getElementById('total-parent').textContent = totalParent;
        })
        .catch(error => console.error('Error fetching parent:', error));


    // Data kid
    fetch('http://157.10.44.240:8080/api/children', {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching Children');
            }
            return response.json();
        })
        .then(data => {
            const totalChildren = data.length;
            document.getElementById('total-children').textContent = totalChildren;
        })
        .catch(error => console.error('Error fetching children:', error));


    // Data classroom
    fetch('http://157.10.44.240:8080/api/classroom', {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching classrooms');
            }
            return response.json();
        })
        .then(data => {
            const totalClassrooms = data.length;
            document.getElementById('total-classrooms').textContent = totalClassrooms;
        })
        .catch(error => console.error('Error fetching classrooms:', error));

}
