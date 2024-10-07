import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "../../_helpers/helper";
import { companyAdmins } from "../../services/UserService/UserService";
import { MdRemoveRedEye } from "react-icons/md";

export const Users = () => {
  const [userList, setUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    fetchUsersLists();
  }, [currentPage, debouncedSearchTerm]);

  const fetchUsersLists = async () => {
    try {
      const response = await companyAdmins(
        currentPage,
        itemsPerPage,
        debouncedSearchTerm?.trim()
      );
      if (response?.status) {
        setUserList(response?.data || []);
        const totalPagesCount = Math.ceil(response?.totalCount / itemsPerPage);
        setTotalPages(totalPagesCount);
      } else {
        setUserList([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUserList([]);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="companySec container wrapperSec minHeight70vh formMainDiv">
      <div className="pageTitle d-flex justify-content-between align-items-center cardTitle">
        <h6>Users List</h6>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1)
          }}
          className="form-control my-3"
          style={{ width: "30vw" }}
        />
      </div>

      <div className="recommendedSec">
        <table className="table table-striped ">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userList.length > 0 ? (
              userList.map((item, i) => (
                <tr key={i}>
                  <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                  <td>{`${item.firstName} ${item.lastName}`}</td>
                  <td>{item.email}</td>
                  <td>
                    {item.userRole?.role?.level === 0 ? "Super Admin" : "User"}
                  </td>
                  <td>
                    <Link to={`/user/views/${item.id}`}>
                      <MdRemoveRedEye size={18} />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No users found...</td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <nav>
            <ul className="pagination">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};
