import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export default function SearchUser({ data, setData }) {

  const users = useSelector(state => state.users.all.filter(u => u.isAdmin != "1"));
  const [selectEmail, setSelectEmail] = useState("");

  useEffect(() => {
    if (data.userId !== "0") {
      let selectedUsers = users.filter(u => u.id === data.userId);
      if (selectedUsers.length > 0) {
        setSelectEmail(selectedUsers[0].email);
      }
    }
  }, [data])

  useEffect(() => {
    if (selectEmail !== "") {
      let selectedUsers = users.filter(u => u.email === selectEmail);
      if (selectedUsers.length > 0) {
        setData(prevState => ({
          ...data,
          "userId": selectedUsers[0].id
        }));
      }
    }
  }, [selectEmail])

  return (
    <div className="d-inline-flex me-3">
      <input name="userId" value={selectEmail} onChange={(e) => setSelectEmail(e.target.value)} list="datalistUsers" className="form-control form-control-sm"
        placeholder="Set User..." />
      <datalist id="datalistUsers">
        {users.map(user => <option key={user.id} value={user.email}>{user.firstname} {user.lastname}</option>)}
      </datalist>
    </div>
  )
}
