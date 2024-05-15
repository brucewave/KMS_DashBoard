var parentAPI = 'http://157.10.44.240:8080/api/parent'

function start(token) {
    getParent(token, renderParent);
}

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

function renderParent(parent) {
    var listParentBlock = document.querySelector("#parent-table");
    var htmls = parent.map(function name(key) {
        return `
        <tr>
        <td>${key.fullName}</td>
        <td>${key.phoneNumber}</td>
        <td class="password">${maskPassword(key.password)}</td>
        <td>${key.email}</td>
        <td>${key.address}</td>
        <td>
            <a href="#" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="" data-original-title="Edit">Sửa</i></a>
            <a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="" data-original-title="Delete">Xóa</i></a>
        </td>
        </tr>
        `
    })
    listParentBlock.innerHTML = htmls.join('');

}


function maskPassword(password) {
    if (password.length > 10) {
        return password.substring(0, 7) + '...';
    } else {
        return password;
    }
}
