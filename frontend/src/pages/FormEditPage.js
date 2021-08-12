import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, useHistory, useParams } from 'react-router-dom'
import AnswerList from '../components/AnswerList'
import LoadingSpinner from '../components/LoadingSpinner'
import SearchUser from '../components/SearchUser'
import FormModel from '../models/FormModel'
import FormService from '../services/formService'
import { addForm, deleteForm, updateForm } from '../store/formSlice'
import { toast } from 'react-toastify';

export default function FormEditPage() {
  const { formId } = useParams()

  const history = useHistory()

  const dispacth = useDispatch()

  const [formData, setFormData] = useState(new FormModel());

  const [isLoad, setIsLoad] = useState(false);

  const [isUpdateForm, setIsUpdateForm] = useState(formId);

  const [disabledBtn, setDisabledBtn] = useState(false)

  const formService = new FormService();

  useEffect(() => {
    if (formId) {
      formService.getFormDetail(formId).then(res => {
        setFormData(Object.assign({}, new FormModel(res)));
        setIsLoad(true);
      });
    } else {
      setIsLoad(true);
    }
  }, [])

  const sendForm = () => {
    if (!formData.title) {
      toast.warning("Lütfen Form Başlığı Belirtin.");
      return;
    }
    formService.addForm(formData).then((id) => {
      dispacth(addForm({ ...formData, id: id }));
      history.push(`/admin/form-edit/${id}`);
      toast.success("Form Eklendi.");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
  }

  const sendUpdateForm = () => {
    if (!formData.title) {
      toast.warning("Lütfen Form Başlığı Belirtin.");
      return;
    }
    setDisabledBtn(true);
    formService.updateForm(formData).then(r => {
      dispacth(updateForm(formData));
      setTimeout(() => {
        setDisabledBtn(false);
      }, 200);
      toast.success("Güncelleme Başarılı.");
    })
  }

  const removeForm = () => {
    const s = window.confirm("Formu silmek üzeresiniz.")
    if (!s) return;
    formService.deleteForm(formId).then(r => {
      dispacth(deleteForm(formId));
      history.push("/admin/forms");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    })
  }

  const duplicateForm = (e) => {
    setFormData({
      ...formData,
      id: null,
      isAnswered: 0,
      updateDate: '',
    });
    setIsUpdateForm(null);
  }

  /* */

  const handleInput = (e) => {
    setFormData(prevState => ({
      ...formData,
      [e.target.name]: e.target.value
    }))
  }

  const handleCheckbox = (e) => {
    setFormData(prevState => ({
      ...formData,
      [e.target.name]: e.target.checked ? "1" : "0"
    }))
  }

  return (
    <div className="form-edit-page">
      <div className="d-flex">
        <h2 className="h5 me-3">{isUpdateForm ? 'Update Form' : 'Add New Form'}</h2>
        <SearchUser data={formData} setData={setFormData} />
        {isUpdateForm && isLoad
          ?
          <div className="ms-auto">
            <button className="btn btn-sm btn-outline-secondary me-2" onClick={(e) => duplicateForm(e)}>Duplicate</button>
            <button className="btn btn-sm btn-outline-danger" onClick={(e) => removeForm(e)}>Delete Form</button>
          </div>
          : <></>}
      </div>

      {
        isLoad
          ?
          <>
            <input name="title" value={formData.title} onChange={handleInput} className="form-control mt-3" placeholder="Form Title" />

            <h4 className="h5 mb-2 pb-3 d-flex align-items-end sticky-top bg-white border-bottom mt-1 pt-3" style={{ zIndex: '2', top: '55px' }}>
              Answers
              <div className="form-check ps-3 mb-0" style={{ fontSize: "0.9em" }}>
                <input type="checkbox" name="isAnswered" checked={formData.isAnswered === "1"} onChange={handleCheckbox} className="form-check-input mx-1" />
                <small style={{ fontSize: "0.7em" }}>Answered</small>
              </div>
              <div className="ms-auto">
                {isUpdateForm
                  ? <>
                    <NavLink className="btn btn-sm btn-outline-dark" to={`/form/${formId}`} target={'_blank'} rel="noreferrer">
                      <i className="bi bi-eye"></i> VİEW
                    </NavLink>
                    <button className="btn btn-dark btn-sm ms-2" onClick={sendUpdateForm} disabled={disabledBtn}>UPDATE FORM</button>
                  </>
                  : <button className="btn btn-dark btn-sm ms-2" onClick={sendForm}>SEND FORM</button>}
              </div>
            </h4>

            <div style={{ minHeight: "25vh" }} className="container-brief pb-5">
              <AnswerList formData={formData} setFormData={setFormData} isAdmin={true} />
            </div>
          </>
          :
          <LoadingSpinner />
      }

    </div>
  )
}
