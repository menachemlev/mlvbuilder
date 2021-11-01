import "./AdminAccess.css";
import AdminTableRow from "./AdminTableRow";
function AdminAccess(props) {
  return (
    <table className="adminTable">
      <thead>
        <tr>
          <td>User's email</td>
          <td className="delete">Delete user</td>
          <td>Select website</td>
          <td className="delete">Delete website</td>
          <td>Visit website</td>
        </tr>
      </thead>
      <tbody>
        {props.users.map((user) => {
          return <AdminTableRow onchange={props.onchange} data={user} />;
        })}
      </tbody>
    </table>
  );
}

export default AdminAccess;
